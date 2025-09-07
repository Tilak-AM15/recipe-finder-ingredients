// Replace with your own Spoonacular API key
const API_KEY = "28d4683b39fe4d3aa761bf869c80d06a";

// Load search history on page load
document.addEventListener("DOMContentLoaded", loadHistory);

async function getRecipes(ingredientsInput) {
  let ingredients;

  if (typeof ingredientsInput === "string") {
    ingredients = ingredientsInput;
    document.getElementById("ingredients").value = ingredients; // Fill input box
  } else {
    ingredients = document.getElementById("ingredients").value;
  }

  if (!ingredients) {
    alert("Please enter some ingredients!");
    return;
  }

  // Save search to history
  saveToHistory(ingredients);

  const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=6&apiKey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    displayRecipes(data);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    alert("Something went wrong. Try again!");
  }
}

function displayRecipes(recipes) {
  const container = document.getElementById("recipes");
  container.innerHTML = "";

  if (recipes.length === 0) {
    container.innerHTML = "<p>No recipes found. Try different ingredients!</p>";
    return;
  }

  recipes.forEach(recipe => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}">
      <h3>${recipe.title}</h3>
      <a href="https://spoonacular.com/recipes/${recipe.title.replace(/ /g, "-")}-${recipe.id}" target="_blank">View Recipe</a>
    `;

    container.appendChild(card);
  });
}

// Save searches to localStorage
function saveToHistory(ingredients) {
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  
  // Avoid duplicates
  if (!history.includes(ingredients)) {
    history.push(ingredients);
    localStorage.setItem("searchHistory", JSON.stringify(history));
    renderHistory();
  }
}

// Render history list
function renderHistory() {
  const historyList = document.getElementById("history");
  historyList.innerHTML = "";

  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

  history.forEach((item, index) => {
    const li = document.createElement("li");
    
    // Ingredient text
    const span = document.createElement("span");
    span.textContent = item;
    span.onclick = () => getRecipes(item);

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.classList.add("delete-btn");
    delBtn.onclick = (e) => {
      e.stopPropagation(); // prevent re-search when deleting
      deleteHistoryItem(index);
    };

    li.appendChild(span);
    li.appendChild(delBtn);
    historyList.appendChild(li);
  });
}

// Delete individual history item
function deleteHistoryItem(index) {
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  history.splice(index, 1); // remove selected item
  localStorage.setItem("searchHistory", JSON.stringify(history));
  renderHistory();
}

// Clear all history
function clearHistory() {
  localStorage.removeItem("searchHistory");
  renderHistory();
}

// Load history on page load
function loadHistory() {
  renderHistory();
}
