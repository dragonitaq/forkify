/* ########################################################################## */
/*                            Global App Controller                           */
/* ########################################################################## */

import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from "./views/SearchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import { elements, renderLoader, clearLoader } from "./views/base";

/* ############################## Global State ############################## */
/**
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - liked recipes object
 */

const state = {};

/* ########################################################################## */
/*                              Search Controller                             */
/* ########################################################################## */

const controlSearch = async () => {
  // 1) Get query from view
  const query = searchView.getInput();
  if (query) {
    // 2) Create new search object and add into global state
    state.search = new Search(query);
    // 3) Prepare UI for result (show the loading icon)
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);
    try {
      /* We actually have nested try-catch here.
      I think it's because the try-catch in getResults() in Search.js is for developer to log the error.
      Whereas the try-catch here is for developer to render UI to show error for user.
      Also it prevents further unwanted code to run. */
      // 4) Do API search
      await state.search.getResults();
      // 5) Render the result in view
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (error) {
      // This is where we usually render error message on UI instead of alert
      alert("Opps, something went wrong in Search Controller.");
    }
  }
};

/* ########################################################################## */
/*                              Recipe Controller                             */
/* ########################################################################## */

const controlRecipe = async () => {
  // get id from URL
  const id = window.location.hash.replace("#", "");
  // We add "if" here because when the url is without an id (which is the base url), code below won't fire
  if (id) {
    // prepare UI for recipe (show the loading icon)
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    // Hightlight selected search item
    if (state.search) searchView.highlightSelected(id);
    // create new recipe object
    state.recipe = new Recipe(id);
    try {
      // get recipe data
      await state.recipe.getRecipe();
      // Parse ingredients into individual objects
      state.recipe.parseIngredients();
      // calculate servings & time
      state.recipe.calcTime();
      state.recipe.calcServing();
      // render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (error) {
      // This is where we usually render error message on UI instead of alert
      alert("Opps, something went wrong in Recipe Controller.");
    }
  }
};

/* ########################################################################## */
/*                               List Controller                              */
/* ########################################################################## */

const controlList = () => {
  // Create a new list if there isn't any
  if (!state.list) state.list = new List();
  //Add each ingredient to the list & UI
  state.recipe.ingredients.forEach((element) => {
    const item = state.list.addItem(element.count, element.unit, element.ingredient);
    listView.renderItem(item);
  });
};

/* ########################################################################## */
/*                               Like Controller                              */
/* ########################################################################## */

const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  // If user has NOT liked current recipe
  if (!state.likes.isLiked(currentID)) {
    // Add like to the state
    const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.img);
    // Toggle the button
    likesView.toggleLikeBtn(true);
    // Add like to UI list
    likesView.renderLike(newLike);
    // If user HAS liked current recipe
  } else {
    // Remove like from the state
    state.likes.removeLike(currentID);
    // Toggle the button
    likesView.toggleLikeBtn(false);
    // Remove like from UI list
    likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

/* ########################################################################## */
/*                               DOM Controller                               */
/* ########################################################################## */

// Handle search event
elements.searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  controlSearch();
});

// Handle result page navigation
elements.searchResPages.addEventListener("click", (event) => {
  const btn = event.target.closest(".btn-inline");
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

// Handle hashchange & load
// Below is the way to apply few event listeners all together using array
["hashchange", "load"].forEach((event) => window.addEventListener(event, controlRecipe));

// Handle delete & update list item events
elements.shopping.addEventListener("click", (event) => {
  //Get item id as soon as user click on shoppinglist ui layout
  const id = event.target.closest(".shopping__item").dataset.itemid;
  // Handle the delete button
  if (event.target.matches(".shopping__delete, .shopping__delete *")) {
    //Delete from state.list
    state.list.deleteItem(id);
    //Delete from list UI
    listView.deleteItem(id);
    //Handle the count update
  } else if (event.target.matches(".shopping__count-value")) {
    const value = parseFloat(event.target.value);
    state.list.updateCount(id, value);
  }
});

// Restore liked recipes on page load from localStorage
window.addEventListener("load", () => {
  // Create likes object
  state.likes = new Likes();
  // Read & restore liked recipes from localStorage
  state.likes.readStorage();
  // Toggle like menu
  likesView.toggleLikeMenu(state.likes.getNumLikes());
  // Render the existing liked recipes
  state.likes.likes.forEach((like) => likesView.renderLike(like));
});

// Handling recipe UI layout button clicks
elements.recipe.addEventListener("click", (event) => {
  if (event.target.matches(".btn-decrease, .btn-decrease *")) {
    //decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (event.target.matches(".btn-increase, .btn-increase *")) {
    //increase button is clicked
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
    //add to shopping list button is clicked
  } else if (event.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    // Add ingredients to shopping list
    controlList();
  } else if (event.target.matches(".recipe__love, .recipe__love *")) {
    // Like Controller
    controlLike();
  }
});

/* 
There is a bug with Mr.Jonas' code here. Try liking any recipe on current 'Search' page and then go to different page of 'Search' recipe page and then select any of the recipe and like it. Then in the 'Likes' menu, click on the first liked recipe! And you cannot access it.
*/
