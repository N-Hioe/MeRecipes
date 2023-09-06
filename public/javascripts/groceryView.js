console.log(groceryListData)
// Grocery List View
const groceryListContainer = document.createElement('div');
groceryListContainer.classList.add('container-fluid', 'mt-2');

const groceryListMainRow = document.createElement('div');
groceryListMainRow.classList.add('row');

const groceryListImageColumn = document.createElement('div');
groceryListImageColumn.classList.add('col-md-6', 'p-0', 'order-md-2');

const groceryListImage = document.createElement('img');
groceryListImage.src = '/uploads/' + groceryListData.file_src;
groceryListImage.classList.add('img-fluid');
groceryListImage.alt = 'Grocery List Thumbnail';

groceryListImageColumn.appendChild(groceryListImage);

const groceryListDetailsColumn = document.createElement('div');
groceryListDetailsColumn.classList.add('col-md-6', 'p-4');

const groceryListName = document.createElement('h1');
groceryListName.textContent = groceryListData.listName;

const groceryListDescription = document.createElement('p');
groceryListDescription.textContent = groceryListData.listDescription;

const groceryListItemsHeading = document.createElement('h2');
groceryListItemsHeading.classList.add('display-6');
groceryListItemsHeading.textContent = 'Grocery List Items';

const groceryListItemsList = document.createElement('ul');
groceryListItemsList.classList.add('list-group', 'mb-4');

groceryListData.items.forEach(item => {
    const itemListItem = document.createElement('li');
    itemListItem.classList.add('list-group-item');
    itemListItem.textContent = `${item.quantity} / ${item.name}`;
    groceryListItemsList.appendChild(itemListItem);
});

groceryListDetailsColumn.appendChild(groceryListName);
groceryListDetailsColumn.appendChild(groceryListDescription);
groceryListDetailsColumn.appendChild(groceryListItemsHeading);
groceryListDetailsColumn.appendChild(groceryListItemsList);

const groceryListEditButton = document.createElement('button');
groceryListEditButton.classList.add('btn', 'btn-primary');
groceryListEditButton.setAttribute('data-bs-toggle', 'modal');
groceryListEditButton.setAttribute('data-bs-target', '#editGroceryListModal');
groceryListEditButton.textContent = 'Edit Grocery List';

groceryListDetailsColumn.appendChild(groceryListEditButton);

groceryListMainRow.appendChild(groceryListDetailsColumn);
groceryListMainRow.appendChild(groceryListImageColumn);

groceryListContainer.appendChild(groceryListMainRow);

const groceryListView = document.getElementById('groceryListView');
groceryListView.appendChild(groceryListContainer);

function addGroceryListItem() {
    const listItem = createGroceryListItemElement();
    return listItem;
}

function createGroceryListItemElement() {
    const listItemDiv = document.createElement('div');
    listItemDiv.className = 'input-group mb-2';

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.name = 'groceryItemQuantities[]';
    quantityInput.className = 'form-control';
    quantityInput.required = true;

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.name = 'groceryItemNames[]';
    nameInput.className = 'form-control';
    nameInput.required = true;

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'btn btn-danger removeButton';
    removeButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
        </svg>`;
    removeButton.addEventListener('click', function () {
        listItemDiv.remove();
    });

    listItemDiv.appendChild(quantityInput);
    listItemDiv.appendChild(nameInput);
    listItemDiv.appendChild(removeButton);

    return listItemDiv;
}

function setExistingFields() {
    // Set existing name
    const groceryListNameInput = document.getElementById('listName');
    groceryListNameInput.value = groceryListData.listName;

    // Set existing description
    const description = document.getElementById('description');
    description.value = groceryListData.listDescription;
    setExistingGroceryListItems();
}

function setExistingGroceryListItems() {
    const groceryListItems = groceryListData.items;
    for (let i = 0; i < groceryListItems.length; i++) {
        if (i === 0) {
            const firstQuantity = document.querySelector('input[name="groceryItemQuantities[]"]');
            const firstName = document.querySelector('input[name="groceryItemNames[]"]');
            firstQuantity.value = groceryListItems[i].quantity;
            firstName.value = groceryListItems[i].name;
            continue;
        }
        const newListItem = addGroceryListItem();
        const quantity = newListItem.querySelector('input[name="groceryItemQuantities[]"]');
        const name = newListItem.querySelector('input[name="groceryItemNames[]"]');
        quantity.value = groceryListItems[i].quantity;
        name.value = groceryListItems[i].name;
    }
}

// Set existing grocery list fields when editing
groceryListEditButton.addEventListener('click', () => {
    setExistingFields();
});
