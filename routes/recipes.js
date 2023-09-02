const express = require('express');
const router = express.Router();
const uuid = require('uuid');

const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config()

const recipeList = [];
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
router.post('/create', async (req, res) => {
    const recipeId = uuid.v4();
    const recipeName = req.body.recipeName;
    const description = req.body.recipeName;
    const tags = req.body.tags;
    const ingredientQuantities = req.body.ingredientQuantities;
    const ingredientUnits = req.body.ingredientUnits;
    const ingredientNames = req.body.ingredients;
    const steps = req.body.steps;

    const recipeData = {
        id: uuid.v4(),
        recipeName,
        description,
        tags,
        ingredients: [],
        steps,
    };

    for (let i = 0; i < ingredientNames.length; i++) {
        const ingredientObject = {
            quantity: ingredientQuantities[i],
            unit: ingredientUnits[i],
            name: ingredientNames[i]
        };
        recipeData.ingredients.push(ingredientObject);
    }

    try {
        await insertRecipe(recipeData);
        res.status(200).json({ message: 'Recipe created successfully', recipeId });
    } catch(error) {
        console.log('Error inserting recipe', error);
        res.status(500).json({ error: 'Failed to create recipe' });
    }
});

    

// GET /recipe/list - Display a list of all recipes
router.get('/list', async (req, res) => {
    const recipes = await getRecipes();
    // console.log(recipes);
    res.render('viewRecipes', { recipes });
});

// GET /recipe/:id - Display details of a specific recipe
router.get('/:id', (req, res) => {
    const recipeId = req.params.id;
    res.send(`Details of recipe with ID ${recipeId}`); // Replace with actual details HTML
});


// Get all Recipes
async function getRecipes() {
    const [rows] = await pool.query("SELECT * FROM recipes");
    return rows;  
}

// Insert Recipe
async function insertRecipe(recipeData) {
    pool.query(
        'INSERT INTO recipes (id, recipeName, recipeDescription, tags, ingredients, steps) VALUES (?, ?, ?, ?, ?, ?)',
        [recipeData.id, recipeData.recipeName, recipeData.description, JSON.stringify(recipeData.tags), JSON.stringify(recipeData.ingredients), JSON.stringify(recipeData.steps)]
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



module.exports = router;
