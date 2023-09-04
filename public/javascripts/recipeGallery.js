console.log(recipesData);

const tagsFilters = document.querySelectorAll('input[type="checkbox"][name="tags[]"]');

const prepTimeFilters = document.querySelectorAll('input[type="radio"][name="prep-times"]');
console.log(prepTimeFilters);

const searchBar = document.getElementById('search-bar');

prepTimeFilters.forEach(time => {
    time.addEventListener('change', updateFilter);
});

tagsFilters.forEach(tag => {
    tag.addEventListener('change', updateFilter);
});

searchBar.addEventListener('input', updateFilter);

// Initial filter
updateFilter();

function updateFilter() {
    const taggedValues = Array.from(tagsFilters)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    const prepTimeFilter = Array.from(prepTimeFilters)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    const searchValue = searchBar.value.trim().toLowerCase();

    const filteredRecipes = recipesData.filter(recipe => {
        const name = recipe.recipeName.toLowerCase();
        const tags = recipe.tags.map(tag => tag.toLowerCase());
        const prepTime = recipe.recipeTime;

        const nameMatch = name.includes(searchValue);
        const tagsMatch = taggedValues.every(filterValue => tags.includes(filterValue));
        let prepTimeMatch = (prepTime <= prepTimeFilter);
        if (!prepTimeFilter[0]) {
            prepTimeMatch = true;
        }


        return nameMatch && tagsMatch && prepTimeMatch;
    });

    renderDefault(filteredRecipes);
}

function renderDefault(recipesData) {
    const recipesContainer = document.getElementById('recipes-container');
    recipesContainer.innerHTML = '';
    recipesContainer.classList.add('row');

    recipesData.forEach(recipe => {
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

        recipesContainer.appendChild(recipeObject);
    });
}


