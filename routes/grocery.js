const express = require('express');
const router = express.Router();
const uuid = require('uuid');

const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config()

const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'public', 'uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.jpg');
    },
});

const upload = multer({ storage: storage });

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

// GET /grocery/create - Display form to create a new grocery list
router.get('/create', (req, res) => {
    res.status(200).render('createGroceryList');
});


// POST /grocery/create - Handle form submission to create a new grocery list
router.post('/create', upload.single('imageFile'), async (req, res) => {

    const groceryData = getGroceryReqData(req);
    try {
        await insertGroceryList(groceryData);
        const groceryLists = await getGroceryLists();
        res.status(200).redirect('/grocery/list');
    } catch(error) {
        console.log('Error inserting grocery list', error);
        res.status(500).json({ error: 'Failed to create grocery list'});
    }
});

// GET /grocery/list - Display all grocery lists
router.get('/list', async (req, res) => {
    const groceryLists = await getGroceryLists();
    res.status(200).render('viewGroceryGallery', { groceryLists });
});

// GET /grocery/:id - Display details of a specific grocery list
router.get('/:id', async (req, res) => {
    const groceryId = req.params.id;
    try {
        const groceryList = await getGroceryList(groceryId);
        res.status(200).render('viewGroceryList', { groceryList });
    } catch (error) {
        console.log(error);
        res.status(404).send({ error:'Grocery list not found.' });
    }
});

// DELETE /grocery/:id - Delete a grocery list
router.delete('/:id', async (req, res) => {
    const groceryId = req.params.id;
    try {

        // Delete image from file system
        await deleteImage(groceryId)

        // Delete recipe query
        await deleteGroceryList(groceryId);

        res.status(200).send('Successfully deleted grocery list.');
    } catch (error) {
        console.log(error);
        res.status(500).send({error: 'Failed to delete grocery list.' });
    }
});

// POST /grocery/edit/:id - Edit grocery
router.post('/edit/:id', upload.single('imageFile'), async (req, res) => {
    const groceryData = getGroceryReqData(req);
    try {
        // Delete image from file system
        await deleteImage(groceryData.id)
    
        await editGroceryList(groceryData);
    } catch (error) {
        console.log(error);
        res.status(500).send({error: 'Failed to edit grocery list.' });
    }
    res.status(200).redirect(`/grocery/${groceryData.id}`);
});


function getGroceryReqData(req) {
    let groceryId = req.body.groceryListId;
    if (!groceryId) {
        groceryId = uuid.v4();
    }
    const listName = req.body.listName;
    const description = req.body.description;
    const itemQuantities = req.body.groceryItemQuantities;
    const itemNames = req.body.groceryItemNames;

    const groceryData = {
        id: groceryId,
        listName,
        description,
        items: [],
        image: null,
    };

    if (req.file) {
        console.log('Storing image in database.')
        const imageUrl = req.file.filename;
        groceryData.image = imageUrl;
    }

    for (let i = 0; i < itemQuantities.length; i++) {
        const itemObject = {
            quantity: itemQuantities[i],
            name: itemNames[i]
        };
        groceryData.items.push(itemObject);
    }
    return groceryData;
}

async function insertGroceryList(groceryData) {
    await pool.query(
        'INSERT INTO groceries (id, listName, listDescription, items, file_src) VALUES (?, ?, ?, ?, ?)',
        [groceryData.id, groceryData.listName, groceryData.description, JSON.stringify(groceryData.items), groceryData.image || null]
    );
}

async function getGroceryLists() {
    const [rows] = await pool.query("SELECT * FROM groceries");
    return rows;  
}

async function getGroceryList(id) {
    const [rows] = await pool.query(`
    SELECT * FROM groceries
    WHERE id = ?
    `, [id]);
    return rows;  
}

// Delete image from file system
async function deleteImage(groceryListId) {
    console.log(groceryListId);
    const [rows] = await pool.query('SELECT file_src FROM groceries WHERE id = ?', [groceryListId]);
    console.log(rows);
    console.log(rows[0]);
    const image = rows[0].file_src;

    // Delete image in file system
    if (image) {
        const imagePath = path.join(__dirname, '..', 'public', 'uploads', image);
        fs.unlink(imagePath, (err => {
            if (err) {
                console.error('Error deleting image:', err);
            } else {
                console.log('Image deleted successfully');
            }
        }));
    } 
}

// Delete grocery list
async function deleteGroceryList(id) {
    await pool.query(`
    DELETE FROM groceries
    WHERE id = ?
    `, [id]);
}

// Edit grocery list
async function editGroceryList(groceryListData) {
    await pool.query(`
    UPDATE groceries
    SET listName = ?,
        listDescription = ?,
        items = ?,
        file_src = ?
    WHERE id = ?`, [groceryListData.listName, groceryListData.description, JSON.stringify(groceryListData.items), groceryListData.image, groceryListData.id])
}

module.exports = router;
