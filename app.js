const RecipeApp = (() => {
  console.log("RecipeApp initializing...");

  // ---------------- DATA ----------------
  const recipes = [
    {
      id: 1,
      title: "Pasta",
      difficulty: "easy",
      time: 20,
      ingredients: ["Pasta", "Salt", "Oil", "Sauce"],
      steps: [
        "Boil water",
        {
          text: "Prepare sauce",
          substeps: [
            "Heat oil",
            "Add garlic",
            {
              text: "Add spices",
              substeps: ["Add chili", "Add salt"]
            }
          ]
        },
        "Mix pasta with sauce"
      ]
    },
    {
      id: 2,
      title: "Fried Rice",
      difficulty: "medium",
      time: 35,
      ingredients: ["Rice", "Vegetables", "Soy sauce"],
      steps: [
        "Cook rice",
        "Heat pan",
        "Add vegetables",
        "Mix rice",
        "Serve hot"
      ]
    }
  ];

  // ---------------- STATE ----------------
  let currentFilter = "all";
  let currentSort = "none";

  // ---------------- DOM ----------------
  const recipeContainer = document.getElementById("recipe-container");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const sortButtons = document.querySelectorAll(".sort-btn");

  // ---------------- PURE FUNCTIONS ----------------

  const applyFilter = (data, filter) => {
    switch (filter) {
      case "easy":
        return data.filter(r => r.difficulty === "easy");
      case "medium":
        return data.filter(r => r.difficulty === "medium");
      case "hard":
        return data.filter(r => r.difficulty === "hard");
      case "quick":
        return data.filter(r => r.time < 30);
      default:
        return data;
    }
  };

  const applySort = (data, sortType) => {
    const copy = [...data];

    switch (sortType) {
      case "name":
        return copy.sort((a, b) => a.title.localeCompare(b.title));
      case "time":
        return copy.sort((a, b) => a.time - b.time);
      default:
        return data;
    }
  };

  // ---------------- RECURSION ----------------

  const renderSteps = (steps, level = 0) => {
    let html = "";

    steps.forEach(step => {
      if (typeof step === "string") {
        html += `<div class="step level-${level}">• ${step}</div>`;
      } else {
        html += `<div class="step level-${level}">• ${step.text}</div>`;
        html += renderSteps(step.substeps, level + 1);
      }
    });

    return html;
  };

  const createStepsHTML = (steps, id) => {
    return `
      <div class="steps-container" data-recipe-id="${id}">
        <h4>Steps</h4>
        ${renderSteps(steps)}
      </div>
    `;
  };

  const createIngredientsHTML = (ingredients, id) => {
    return `
      <div class="ingredients-container" data-recipe-id="${id}">
        <h4>Ingredients</h4>
        <ul>
          ${ingredients.map(i => `<li>${i}</li>`).join("")}
        </ul>
      </div>
    `;
  };

  // ---------------- RENDER ----------------

  const createRecipeCard = recipe => {
    return `
      <div class="recipe-card">
        <h3>${recipe.title}</h3>
        <p>Difficulty: ${recipe.difficulty}</p>
        <p>Time: ${recipe.time} mins</p>

        <button class="toggle-btn"
          data-recipe-id="${recipe.id}"
          data-toggle="steps">
          Show Steps
        </button>

        <button class="toggle-btn"
          data-recipe-id="${recipe.id}"
          data-toggle="ingredients">
          Show Ingredients
        </button>

        ${createStepsHTML(recipe.steps, recipe.id)}
        ${createIngredientsHTML(recipe.ingredients, recipe.id)}
      </div>
    `;
  };

  const renderRecipes = data => {
    recipeContainer.innerHTML = data.map(createRecipeCard).join("");
  };

  // ---------------- UPDATE DISPLAY ----------------

  const updateDisplay = () => {
    let data = recipes;
    data = applyFilter(data, currentFilter);
    data = applySort(data, currentSort);
    renderRecipes(data);
  };

  // ---------------- BUTTON STATES ----------------

  const updateActiveButtons = () => {
    filterButtons.forEach(btn => {
      btn.classList.toggle(
        "active",
        btn.dataset.filter === currentFilter
      );
    });

    sortButtons.forEach(btn => {
      btn.classList.toggle(
        "active",
        btn.dataset.sort === currentSort
      );
    });
  };

  // ---------------- EVENT HANDLERS ----------------

  const handleFilterClick = e => {
    currentFilter = e.target.dataset.filter;
    updateActiveButtons();
    updateDisplay();
  };

  const handleSortClick = e => {
    currentSort = e.target.dataset.sort;
    updateActiveButtons();
    updateDisplay();
  };

  // 🔥 EVENT DELEGATION FOR TOGGLES

  const handleToggleClick = e => {
    const button = e.target.closest(".toggle-btn");
    if (!button) return;

    const id = button.dataset.recipeId;
    const type = button.dataset.toggle;

    const container = document.querySelector(
      `.${type}-container[data-recipe-id="${id}"]`
    );

    container.classList.toggle("visible");

    button.textContent =
      container.classList.contains("visible")
        ? `Hide ${type.charAt(0).toUpperCase() + type.slice(1)}`
        : `Show ${type.charAt(0).toUpperCase() + type.slice(1)}`;
  };

  // ---------------- SETUP ----------------

  const setupEventListeners = () => {
    filterButtons.forEach(btn =>
      btn.addEventListener("click", handleFilterClick)
    );

    sortButtons.forEach(btn =>
      btn.addEventListener("click", handleSortClick)
    );

    recipeContainer.addEventListener("click", handleToggleClick);

    console.log("Event listeners attached!");
  };

  // ---------------- INIT ----------------

  const init = () => {
    updateDisplay();
    setupEventListeners();
    console.log("RecipeApp ready!");
  };

  return { init, updateDisplay };
})();

// 🚀 start app
RecipeApp.init();
