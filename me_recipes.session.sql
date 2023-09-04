--@block
SHOW DATABASES;
--@block
USE ME_RECIPES;
--@block
DROP TABLE recipes --@block
CREATE TABLE recipes (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    recipeName VARCHAR(255) NOT NULL,
    recipeDescription TEXT NOT NULL,
    tags JSON,
    recipeTime INTEGER NOT NULL,
    ingredients JSON NOT NULL,
    steps JSON NOT NULL,
    file_src TEXT NOT NULL
);