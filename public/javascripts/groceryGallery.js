console.log(groceryListsData); // Assuming you have groceryListsData

const groceryListsPerPage = 9;
let currentGroceryPage = 1;

const searchBar = document.getElementById('search-bar');

if (!groceryListsData[0]) {
    renderEmptyGroceryLists();
} else {
    // Initial filter
    updateGroceryFilter();
    searchBar.addEventListener('input', updateGroceryFilter);
}

function renderEmptyGroceryLists() {
    const groceryListsContainer = document.getElementById('grocery-lists-container');
    var noGroceryListsMessage = document.createElement("div");
    noGroceryListsMessage.classList.add('flex', 'text-center', 'm-4', 'p-4')

    let image = document.createElement("img");
    image.src = '/images/MeRecipesLogo.png';
    image.classList.add("img-fluid");
    image.alt = "Grocery List Placeholder Image";

    let paragraph = document.createElement("p");
    paragraph.classList.add('my-2', 'py-2');
    paragraph.textContent = "No grocery lists made yet.";

    let createBtn = document.createElement("a");
    createBtn.setAttribute('href', '/grocery/create');
    createBtn.classList.add("btn", "btn-primary");
    createBtn.textContent = "Create your first grocery list!";

    noGroceryListsMessage.appendChild(image);
    noGroceryListsMessage.appendChild(paragraph);
    noGroceryListsMessage.appendChild(createBtn);

    groceryListsContainer.appendChild(noGroceryListsMessage);
}

function updateGroceryFilter() {
    const searchValue = searchBar.value.trim().toLowerCase();

    const filteredGroceryLists = groceryListsData.filter(groceryList => {
        const listName = groceryList.listName.toLowerCase();
        const nameMatch = listName.includes(searchValue);
        return nameMatch;
    });

    renderDefaultGroceryLists(filteredGroceryLists);
}

function renderDefaultGroceryLists(filteredGroceryLists) {
    const startIndex = (currentGroceryPage - 1) * groceryListsPerPage;
    const endIndex = startIndex + groceryListsPerPage;
    const groceryListsToRender = filteredGroceryLists.slice(startIndex, endIndex);

    const groceryListsContainer = document.getElementById('grocery-lists-container');
    groceryListsContainer.innerHTML = '';

    let groceryListsRow;
    console.log('hey', groceryListsToRender);
    groceryListsToRender.forEach((groceryList, index) => {
        if (index % 3 === 0) {
            // Create a new row for every 3rd grocery list
            groceryListsRow = document.createElement('div');
            groceryListsRow.classList.add('row');
            groceryListsContainer.appendChild(groceryListsRow);
        }
        const groceryListObject = document.createElement('div');
        groceryListObject.classList.add('col-lg-4', 'col-md-6', 'col-sm-12', 'mb-4');

        const groceryListCard = document.createElement('div');
        groceryListCard.classList.add('card', 'position-relative');

        const deleteButton = document.createElement('a');
        deleteButton.classList.add('link-danger', 'link-opacity-50-hover', 'position-absolute', 'top-0', 'end-0', 'mt-1', 'me-1'); 
        deleteButton.setAttribute('role', 'button');
        deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16"> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>`;

        deleteButton.addEventListener('click', (event) => {
            const isConfirmed = confirm('Are you sure you want to delete this grocery list?');
            if (isConfirmed) {
                fetch(`/grocery/${groceryList.id}`, {
                    method: 'DELETE',
                })
                    .then(response => {
                        if (response.ok) {
                            window.location.reload();
                        } else {
                            console.error('Failed to delete grocery list.');
                            window.location.reload();
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }
        });

        const groceryListImage = document.createElement('img');
        groceryListImage.classList.add('card-img-top');
        groceryListImage.setAttribute('src', '/uploads/' + groceryList.file_src);
        groceryListImage.setAttribute('alt', groceryList.file_src);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const groceryListTitle = document.createElement('h5');
        groceryListTitle.classList.add('card-title');
        groceryListTitle.textContent = groceryList.listName;

        const groceryListDescription = document.createElement('p');
        groceryListDescription.classList.add('card-text');
        groceryListDescription.textContent = groceryList.listDescription;

        cardBody.appendChild(groceryListTitle);
        cardBody.appendChild(groceryListDescription);

        const cardFooter = document.createElement('div');
        cardFooter.classList.add('card-footer', 'text-center');

        const viewButton = document.createElement('a');
        viewButton.classList.add('btn', 'btn-primary');
        viewButton.setAttribute('href', `/grocery/${groceryList.id}`);
        viewButton.textContent = 'View Grocery List';

        cardFooter.appendChild(viewButton);

        groceryListCard.appendChild(deleteButton); 
        groceryListCard.appendChild(groceryListImage);
        groceryListCard.appendChild(cardBody);
        groceryListCard.appendChild(cardFooter);

        groceryListObject.appendChild(groceryListCard);
        groceryListsRow.appendChild(groceryListObject);
    });

    renderPaginationGroceryLists(filteredGroceryLists.length);
}

function renderPaginationGroceryLists(totalGroceryLists) {
    const totalPages = Math.ceil(totalGroceryLists / groceryListsPerPage);
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';

    if (totalPages <= 1) {
        // No need for pagination if there's only one page
        return;
    }

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('btn', 'btn-secondary', 'me-2');

        if (i === currentGroceryPage) {
            pageButton.classList.add('active');
        }

        pageButton.addEventListener('click', () => {
            currentGroceryPage = i;
            renderDefaultGroceryLists(filteredGroceryLists);
        });

        paginationContainer.appendChild(pageButton);
    }
}
