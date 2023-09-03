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

// GET /recipe/create - Display form to create a new recipe
router.get('/create', (req, res) => {
    res.status(200).render('createRecipe'); // Replace with actual form HTML
});

// POST /recipe/create - Handle form submission to create a new recipe
router.post('/create', upload.single('imageFile'), async (req, res) => {

    const recipeData = getRecipeReqData(req);

    try {
        await insertRecipe(recipeData);
        res.status(200).json({ message: 'Recipe created successfully', recipeData });
    } catch(error) {
        console.log('Error inserting recipe', error);
        res.status(500).json({ error: 'Failed to create recipe' });
    }
});
    

// GET /recipe/list - Display a list of all recipes
router.get('/list', async (req, res) => {
    const recipes = await getRecipes();
    // console.log(recipes);
    res.render('viewRecipeGallery', { recipes });
});

// GET /recipe/:id - Display details of a specific recipe
router.get('/:id', async (req, res) => {
    const recipeId = req.params.id;
    try {
        const recipe = await getRecipe(recipeId);
        res.status(200).render('viewRecipe', { recipe });
    } catch (error) {
        console.log(error);
        res.status(404).send({ error:'Recipe not found.' });
    }
});

// DELETE /recipe/:id - Delete a recipe
router.delete('/:id', async (req, res) => {
    const recipeId = req.params.id;
    try {

        // Delete image from file system
        await deleteImage(recipeId)

        // Delete recipe query
        await deleteRecipe(recipeId);

        res.status(200).send('Successfully deleted recipe.');
    } catch (error) {
        console.log(error);
        res.status(500).send({error: 'Failed to delete recipe.' });
    }
});

// POST /recipe/edit/:id - Edit recipe
router.post('/edit/:id', upload.single('imageFile'), async (req, res) => {
    const recipeData = getRecipeReqData(req)
    try {
        // Delete image from file system
        await deleteImage(recipeData.id)
    
        await editRecipe(recipeData);
    } catch (error) {
        console.log(error);
        res.status(500).send({error: 'Failed to edit recipe.' });
    }
    res.status(200).redirect(`/recipe/${recipeData.id}`);
});


// Get all Recipes
async function getRecipes() {
    const [rows] = await pool.query("SELECT * FROM recipes");
    return rows;  
}

// Get Recipe Request data
function getRecipeReqData(req) {
    let recipeId = req.body.recipeId;
    if (!recipeId) {
        recipeId = uuid.v4();
    }
    const recipeName = req.body.recipeName;
    const description = req.body.recipeName;
    const tags = req.body.tags;
    const ingredientQuantities = req.body.ingredientQuantities;
    const ingredientUnits = req.body.ingredientUnits;
    const ingredientNames = req.body.ingredients;
    const steps = req.body.steps;

    const recipeData = {
        id: recipeId,
        recipeName,
        description,
        tags,
        ingredients: [],
        steps,
        image: null,
    };

    if (req.file) {
        console.log('Storing image in database.')
        const imageUrl = req.file.filename;
        recipeData.image = imageUrl;
    }

    for (let i = 0; i < ingredientNames.length; i++) {
        const ingredientObject = {
            quantity: ingredientQuantities[i],
            unit: ingredientUnits[i],
            name: ingredientNames[i]
        };
        recipeData.ingredients.push(ingredientObject);
    }

    return recipeData;
}

// Insert Recipe
async function insertRecipe(recipeData) {
    await pool.query(
        'INSERT INTO recipes (id, recipeName, recipeDescription, tags, ingredients, steps, file_src) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [recipeData.id, recipeData.recipeName, recipeData.description, JSON.stringify(recipeData.tags), JSON.stringify(recipeData.ingredients), JSON.stringify(recipeData.steps), recipeData.image || null]
    );
}

// Get a specific recipe by id
async function getRecipe(id) {
    const [rows] = await pool.query(`
    SELECT * FROM recipes
    WHERE id = ?
    `, [id]);
    return rows;  
}

// Delete Recipe
async function deleteRecipe(id) {
    await pool.query(`
    DELETE FROM recipes
    WHERE id = ?
    `, [id]);
}

// Delete image from file system
async function deleteImage(recipeId) {
    const [rows] = await pool.query('SELECT file_src FROM recipes WHERE id = ?', [recipeId]);

    if (rows.length === 0) {
        return res.status(404).json({ error: 'Recipe not found' });
    }

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

async function editRecipe(recipeData) {
    await pool.query(`
    UPDATE recipes
    SET recipeName = ?,
        recipeDescription = ?,
        tags = ?,
        ingredients = ?,
        steps = ?,
        file_src = ?
    WHERE id = ?`, [recipeData.recipeName, recipeData.description, JSON.stringify(recipeData.tags), JSON.stringify(recipeData.ingredients), JSON.stringify(recipeData.steps), recipeData.image, recipeData.id,])
}



module.exports = router;
