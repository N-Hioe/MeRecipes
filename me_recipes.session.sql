--@block
CREATE TABLE recipes (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    recipeName VARCHAR(255) NOT NULL,
    recipeDescription TEXT NOT NULL,
    tags JSON,
    ingredients JSON NOT NULL,
    steps JSON NOT NULL,
    file_src TEXT NOT NULL
);
--@block
DROP TABLE recipes