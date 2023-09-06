console.log(recipesData);

const recipesPerPage = 9;
let currentPage = 1;

const tagsFilters = document.querySelectorAll('input[type="checkbox"][name="tags[]"]');

const prepTimeFilters = document.querySelectorAll('input[type="radio"][name="prep-times"]');

const searchBar = document.getElementById('search-bar');

if (!recipesData[0]) {
    renderEmptyRecipes();
} else {
    // Initial filter
    updateFilter();
    prepTimeFilters.forEach(time => {
        time.addEventListener('change', updateFilter);
    });
    tagsFilters.forEach(tag => {
        tag.addEventListener('change', updateFilter);
    });
    searchBar.addEventListener('input', updateFilter);
}

function renderEmptyRecipes() {
    const recipesContainer = document.getElementById('recipes-container');
    var noRecipesMessage = document.createElement("div");
    noRecipesMessage.classList.add('flex', 'text-center', 'm-4', 'p-4')

    let image = document.createElement("img");
    image.src = '/images/MeRecipesLogo.png';
    image.classList.add("img-fluid");
    image.alt = "Recipe Placeholder Image";

    let paragraph = document.createElement("p");
    paragraph.classList.add('my-2', 'py-2');
    paragraph.textContent = "No recipes made yet. Make your first one now!";

    let createBtn = document.createElement("a");
    createBtn.setAttribute('href', '/recipe/create');
    createBtn.classList.add("btn", "btn-primary");
    createBtn.textContent = "Create your first recipe!";

    noRecipesMessage.appendChild(image);
    noRecipesMessage.appendChild(paragraph);
    noRecipesMessage.appendChild(createBtn);

    recipesContainer.appendChild(noRecipesMessage);
}

function updateFilter() {
    const taggedValues = Array.from(tagsFilters)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    const prepTimeFilter = Array.from(prepTimeFilters)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => parseInt(checkbox.value));

    const searchValue = searchBar.value.trim().toLowerCase();

    const filteredRecipes = recipesData.filter(recipe => {
        const name = recipe.recipeName.toLowerCase();
        const tags = recipe.tags.map(tag => tag.toLowerCase());
        const prepTime = recipe.recipeTime;

        const nameMatch = name.includes(searchValue);
        const tagsMatch = taggedValues.every(filterValue => tags.includes(filterValue));
        let prepTimeMatch = (prepTimeFilter.length === 0) || prepTimeFilter.includes(prepTime);

        return nameMatch && tagsMatch && prepTimeMatch;
    });

    renderDefault(filteredRecipes);
}

function renderDefault(recipesData) {

    const startIndex = (currentPage - 1) * recipesPerPage;
    const endIndex = startIndex + recipesPerPage;
    const recipesToRender = recipesData.slice(startIndex, endIndex);

    const recipesContainer = document.getElementById('recipes-container');
    recipesContainer.innerHTML = '';

    let recipeRow;
    recipesToRender.forEach((recipe, index) => {
        if (index % 3 === 0) {
            // Create a new row for every 3rd recipe
            recipeRow = document.createElement('div');
            recipeRow.classList.add('row');
            recipesContainer.appendChild(recipeRow);
        }
        const recipeObject = document.createElement('div');
        recipeObject.classList.add('col-lg-4', 'col-md-6', 'col-sm-12', 'mb-4');

        const recipeCard = document.createElement('div');
        recipeCard.classList.add('card', 'position-relative');

        const deleteButton = document.createElement('a');
        deleteButton.classList.add('link-danger', 'link-opacity-50-hover', 'position-absolute', 'top-0', 'end-0', 'mt-1', 'me-1'); 
        deleteButton.setAttribute('role', 'button');
        deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16"> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>`;

        deleteButton.addEventListener('click', (event) => {
            const isConfirmed = confirm('Are you sure you want to delete this recipe?');
            if (isConfirmed) {
                fetch(`/recipe/${recipe.id}`, {
                    method: 'DELETE',
                })
                    .then(response => {
                        if (response.ok) {
                            window.location.reload();
                        } else {
                            console.error('Failed to delete recipe');
                            window.location.reload();
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }
        });

        const recipeImage = document.createElement('img');
        recipeImage.classList.add('card-img-top');
        recipeImage.setAttribute('src', '/uploads/' + recipe.file_src);
        recipeImage.setAttribute('alt', recipe.file_src);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const recipeTitle = document.createElement('h5');
        recipeTitle.classList.add('card-title');
        recipeTitle.textContent = recipe.recipeName;

        const recipeDescription = document.createElement('p');
        recipeDescription.classList.add('card-text');
        recipeDescription.textContent = recipe.recipeDescription;

        cardBody.appendChild(recipeTitle);
        cardBody.appendChild(recipeDescription);

        const cardFooter = document.createElement('div');
        cardFooter.classList.add('card-footer', 'text-center');

        const viewButton = document.createElement('a');
        viewButton.classList.add('btn', 'btn-primary');
        viewButton.setAttribute('href', `/recipe/${recipe.id}`);
        viewButton.textContent = 'View Recipe';

        cardFooter.appendChild(viewButton);

        recipeCard.appendChild(deleteButton); 
        recipeCard.appendChild(recipeImage);
        recipeCard.appendChild(cardBody);
        recipeCard.appendChild(cardFooter);

        recipeObject.appendChild(recipeCard);
        recipeRow.appendChild(recipeObject);
    });
    renderPagination(recipesData.length);
}

function renderPagination(totalRecipes) {
    const totalPages = Math.ceil(totalRecipes / recipesPerPage);
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

        if (i === currentPage) {
            pageButton.classList.add('active');
        }

        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderDefault(recipesData);
        });

        paginationContainer.appendChild(pageButton);
    }
}

