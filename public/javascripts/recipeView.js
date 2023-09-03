const container = document.createElement('div');
container.classList.add('container-fluid', 'mt-2');

const mainRow = document.createElement('div');
mainRow.classList.add('row');

const imageColumn = document.createElement('div');
imageColumn.classList.add('col-md-6', 'p-0', 'order-md-2'); 

const recipeImage = document.createElement('img');
recipeImage.src = '/uploads/' + recipeData.file_src;
recipeImage.classList.add('img-fluid');
recipeImage.alt = recipeData.file_src;

imageColumn.appendChild(recipeImage);

const detailsColumn = document.createElement('div');
detailsColumn.classList.add('col-md-6', 'p-4'); 

const recipeTitle = document.createElement('h1');
recipeTitle.textContent = recipeData.recipeName;

const recipeDescription = document.createElement('p');
recipeDescription.textContent = recipeData.recipeDescription;

const tagsHeading = document.createElement('h2');
tagsHeading.classList.add('display-6');
tagsHeading.textContent = 'Tags:';

const tagsList = document.createElement('ul');
tagsList.classList.add('list-group', 'mb-4');

recipeData.tags.forEach(tag => {
    const tagItem = document.createElement('li');
    tagItem.classList.add('list-group-item');
    tagItem.textContent = tag;
    tagsList.appendChild(tagItem);
});

const ingredientsHeading = document.createElement('h2');
ingredientsHeading.classList.add('display-6');
ingredientsHeading.textContent = 'Ingredients';

const ingredientsList = document.createElement('ul');
ingredientsList.classList.add('list-group', 'mb-4');

recipeData.ingredients.forEach(ingredient => {
    const ingredientItem = document.createElement('li');
    ingredientItem.classList.add('list-group-item');
    ingredientItem.textContent = `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`;
    ingredientsList.appendChild(ingredientItem);
});

const stepsHeading = document.createElement('h2');
stepsHeading.classList.add('display-6')
stepsHeading.textContent = 'Steps';

const stepsList = document.createElement('ol');
stepsList.classList.add('list-group', 'mb-4');

recipeData.steps.forEach((step, index) => {
    const stepItem = document.createElement('li');
    stepItem.classList.add('list-group-item');
    stepItem.textContent = `${index + 1}. ${step}`;
    stepsList.appendChild(stepItem);
});

mainRow.appendChild(detailsColumn);
mainRow.appendChild(imageColumn);

container.appendChild(mainRow);

detailsColumn.appendChild(recipeTitle);
detailsColumn.appendChild(recipeDescription);
detailsColumn.appendChild(tagsHeading);
detailsColumn.appendChild(tagsList);
detailsColumn.appendChild(ingredientsHeading);
detailsColumn.appendChild(ingredientsList);
detailsColumn.appendChild(stepsHeading);
detailsColumn.appendChild(stepsList);

const editButton = document.createElement('button');
editButton.classList.add('btn', 'btn-primary', 'mb-4');
editButton.setAttribute('data-bs-toggle', 'modal'); 
editButton.setAttribute('data-bs-target', '#editRecipeModal');
editButton.textContent = 'Edit Recipe';

detailsColumn.appendChild(editButton);

const recipeView = document.getElementById('recipeView');
recipeView.appendChild(container);

function addIngredient() {
    const ingredient = createIngredientElement();
    ingredientsContainer.appendChild(ingredient);
    return ingredient;
}

function addStep() {
    const step = createStepElement();
    stepsContainer.appendChild(step);
    return step;
}

function createIngredientElement() {
    const ingredientDiv = document.createElement('div');
    ingredientDiv.className = 'input-group mb-2';

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.name = 'ingredientQuantities[]';
    quantityInput.className = 'form-control';
    quantityInput.required = true;

    const unitSelect = document.createElement('select');
    unitSelect.name = 'ingredientUnits[]';
    unitSelect.className = 'form-select';
    const measurementUnits = ['count', 'grams', 'ounces', 'cups']; 
    measurementUnits.forEach(unit => {
        const option = document.createElement('option');
        option.value = unit;
        option.text = unit;
        unitSelect.appendChild(option);
    });

    const ingredientInput = document.createElement('input');
    ingredientInput.type = 'text';
    ingredientInput.name = 'ingredients[]';
    ingredientInput.className = 'form-control';
    ingredientInput.required = true;

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'btn btn-danger removeButton';
    removeButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
    </svg>`
    removeButton.addEventListener('click', function () {
        ingredientDiv.remove();
    });

    ingredientDiv.appendChild(quantityInput);
    ingredientDiv.appendChild(unitSelect);
    ingredientDiv.appendChild(ingredientInput);
    ingredientDiv.appendChild(removeButton);

    return ingredientDiv;
}

function createStepElement() {
    const stepDiv = document.createElement('div');
    stepDiv.className = 'input-group mb-2';

    const stepInput = document.createElement('input');
    stepInput.type = 'text';
    stepInput.name = 'steps[]';
    stepInput.className = 'form-control';
    stepInput.required = true;

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'btn btn-danger removeButton';
    removeButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
    </svg>`;
    removeButton.addEventListener('click', function () {
        stepDiv.remove();
    });

    stepDiv.appendChild(stepInput);
    stepDiv.appendChild(removeButton);

    return stepDiv;
}

function setExistingFields() {
    // Set existing name
    const recipeNameInput = document.getElementById('recipeName');
    recipeNameInput.value = recipeData.recipeName;

    // Set existing tags
    const tagsCheckboxes = document.querySelectorAll('input[name="tags[]"]');

    recipeData.tags.forEach(tag => {
        tagsCheckboxes.forEach(checkbox => {
            if (tag === checkbox.value) {
                checkbox.checked = true;
            }
        });
    });

    // Set existing description
    const description = document.getElementById('description');
    description.value = recipeData.recipeDescription;

    // Set existing ingredients
    const ingredients = recipeData.ingredients;
    for (let i = 0; i < ingredients.length; i++) {
        if (i === 0) {
            const firstQuantity = document.querySelector('input[name="ingredientQuantities[]"]');
            const firstUnit = document.querySelector('select[name="ingredientUnits[]"]');
            const firstName = document.querySelector('input[name="ingredients[]"]');
            firstQuantity.value = ingredients[i].quantity;
            firstUnit.value = ingredients[i].unit;
            firstName.value = ingredients[i].name;
            continue;
        }
        const newIngredient = addIngredient();
        const quantity = newIngredient.querySelector('input[name="ingredientQuantities[]"]');
        const unit = newIngredient.querySelector('select[name="ingredientUnits[]"]');
        const name = newIngredient.querySelector('input[name="ingredients[]"]');
        quantity.value = ingredients[i].quantity;
        unit.value = ingredients[i].unit;
        name.value = ingredients[i].name;
    }

    // Set existing steps
    const steps = recipeData.steps;
    for (let i = 0; i < steps.length; i++) {
        if (i === 0) {
            const firstStep = document.querySelector('input[name="steps[]"]');
            firstStep.value = steps[i];
            continue;
        }
        const newStep = addStep();
        const step = newStep.querySelector('input[name="steps[]"]');
        step.value = steps[i];
    }
}

// Set existing recipe fields when editing
editButton.addEventListener('click', () => {
    setExistingFields();
});
