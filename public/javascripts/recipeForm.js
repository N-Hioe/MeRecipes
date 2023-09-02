document.addEventListener('DOMContentLoaded', function () {
    const addIngredientButton = document.getElementById('addIngredientButton');
    const addStepButton = document.getElementById('addStepButton');
    const ingredientsContainer = document.getElementById('ingredientsContainer');
    const stepsContainer = document.getElementById('stepsContainer');
  
    addIngredientButton.addEventListener('click', addIngredient);
    addStepButton.addEventListener('click', addStep);
  
    function addIngredient() {
        const ingredient = createIngredientElement();
        ingredientsContainer.appendChild(ingredient);
    }
  
    function addStep() {
        const step = createStepElement();
        stepsContainer.appendChild(step);
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
});
