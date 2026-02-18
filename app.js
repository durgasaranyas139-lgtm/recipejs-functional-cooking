// ===============================
// IIFE WRAPPER
// ===============================
(() => {
  console.log("RecipeJS App Initialized");

  // ===============================
  // STATE
  // ===============================
  const recipes = window.recipes || []; // your existing data
  let currentFilter = "all";
  let currentSort = "default";
  let searchQuery = "";
  let favorites = JSON.parse(localStorage.getItem("recipeFavorites")) || [];
  let debounceTimer;

  // ===============================
  // DOM REFERENCES
  // ===============================
  const recipeContainer = document.querySelector("#recipe-container");
  const searchInput = document.querySelector("#search-input");
  const clearSearchBtn = document.querySelector("#clear-search");
  const recipeCounter = document.querySelector("#recipe-counter");

  // ===============================
  // DISPLAY FUNCTION
  // ===============================
  const displayRecipes = (data) => {
    recipeContainer.innerHTML = "";

    data.forEach((recipe) => {
      recipeContainer.appendChild(createRecipeCard(recipe));
    });
  };

  // ===============================
  // CREATE RECIPE CARD
  // ===============================
  const createRecipeCard = (recipe) => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    const isFav = favorites.includes(recipe.id);

    card.innerHTML = `
      <h3>${recipe.title}</h3>
      <p>${recipe.description}</p>
      <button 
        class="favorite-btn ${isFav ? "active" : ""}"
        data-recipe-id="${recipe.id}">
        ❤️
      </button>
    `;

    return card;
  };

  // ===============================
  // SEARCH FUNCTION
  // ===============================
  const applySearch = (data, query) => {
    if (!query) return data;

    const lowerQuery = query.toLowerCase().trim();

    return data.filter((recipe) => {
      const titleMatch = recipe.title.toLowerCase().includes(lowerQuery);

      const ingredientMatch = recipe.ingredients.some((ing) =>
        ing.toLowerCase().includes(lowerQuery)
      );

      const descriptionMatch = recipe.description
        .toLowerCase()
        .includes(lowerQuery);

      return titleMatch || ingredientMatch || descriptionMatch;
    });
  };

  // ===============================
  // FILTER FUNCTION
  // ===============================
  const applyFilter = (data, filterType) => {
    if (filterType === "favorites") {
      return data.filter((recipe) => favorites.includes(recipe.id));
    }

    if (filterType === "all") return data;

    return data.filter((recipe) => recipe.category === filterType);
  };

  // ===============================
  // SORT FUNCTION
  // ===============================
  const applySort = (data, sortType) => {
    const sorted = [...data];

    switch (sortType) {
      case "name-asc":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;

      case "name-desc":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;

      default:
        break;
    }

    return sorted;
  };

  // ===============================
  // RECIPE COUNTER
  // ===============================
  const updateCounter = (shown, total) => {
    recipeCounter.textContent = `Showing ${shown} of ${total} recipes`;
  };

  // ===============================
  // FAVORITES MANAGEMENT
  // ===============================
  const toggleFavorite = (id) => {
    const index = favorites.indexOf(id);

    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(id);
    }

    localStorage.setItem("recipeFavorites", JSON.stringify(favorites));
    updateDisplay();
  };

  // ===============================
  // MAIN UPDATE FLOW
  // ===============================
  const updateDisplay = () => {
    let processed = [...recipes];

    // 1️⃣ search
    processed = applySearch(processed, searchQuery);

    // 2️⃣ filter
    processed = applyFilter(processed, currentFilter);

    // 3️⃣ sort
    processed = applySort(processed, currentSort);

    // 4️⃣ counter
    updateCounter(processed.length, recipes.length);

    // 5️⃣ render
    displayRecipes(processed);
  };

  // ===============================
  // SEARCH HANDLER (DEBOUNCED)
  // ===============================
  const handleSearchInput = (e) => {
    clearTimeout(debounceTimer);

    const value = e.target.value;

    debounceTimer = setTimeout(() => {
      searchQuery = value;
      clearSearchBtn.style.display = value ? "inline-block" : "none";
      updateDisplay();
    }, 300);
  };

  // ===============================
  // CLEAR SEARCH
  // ===============================
  const clearSearch = () => {
    searchInput.value = "";
    searchQuery = "";
    clearSearchBtn.style.display = "none";
    updateDisplay();
  };

  // ===============================
  // FAVORITE CLICK (EVENT DELEGATION)
  // ===============================
  const handleFavoriteClick = (e) => {
    if (!e.target.classList.contains("favorite-btn")) return;

    const id = e.target.dataset.recipeId;
    toggleFavorite(id);
  };

  // ===============================
  // EVENT LISTENERS
  // ===============================
  const setupEventListeners = () => {
    searchInput?.addEventListener("input", handleSearchInput);
    clearSearchBtn?.addEventListener("click", clearSearch);
    recipeContainer?.addEventListener("click", handleFavoriteClick);
  };

  // ===============================
  // INIT
  // ===============================
  const init = () => {
    setupEventListeners();
    updateDisplay();
    console.log("RecipeJS Ready 🚀");
  };

  init();
})();
