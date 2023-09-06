document.addEventListener('DOMContentLoaded', function () {
    const addGroceryItemButton = document.getElementById('addGroceryItemButton');
    const groceryItemsContainer = document.getElementById('groceryItemsContainer');

    // Add a new input group for grocery items
    addGroceryItemButton.addEventListener('click', function () {
        const inputGroup = groceryItemsContainer.querySelector('.input-group');
        const clonedInputGroup = inputGroup.cloneNode(true);
        const removeButton = clonedInputGroup.querySelector('.removeGroceryItemButton');
        removeButton.removeAttribute('disabled'); // Enable remove button

        // Add an event listener to the remove button
        removeButton.addEventListener('click', function () {
            groceryItemsContainer.removeChild(clonedInputGroup); // Remove the input group
        });

        // Clear input values in the cloned input group
        clonedInputGroup.querySelectorAll('input').forEach(input => {
            input.value = '';
        });

        // Append the cloned input group
        groceryItemsContainer.appendChild(clonedInputGroup);
    });
});