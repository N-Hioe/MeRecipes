const express = require('express');
const path = require('path');
const app = express();

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const recipes = require('./routes/recipes.js');
const grocery = require('./routes/grocery.js');

app.use('/recipe', recipes);
app.use('/grocery', grocery);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
