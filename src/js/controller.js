import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';

/* if (module.hot) {
  module.hot.accept();
} */

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

/////////////////////////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    //// Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    //updating bookmarks

    bookmarksView.update(model.state.bookmarks);
    //// loading recipe
    await model.loadRecipe(id);

    //redering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    //1 get search query
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();
    //Load search results
    await model.loadSearchResults(query);
    // render results
    console.log(model.state.search.results);
    //resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage(1));
    // Render intial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (gotoPage) {
  resultsView.render(model.getSearchResultsPage(gotoPage));
  // Render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recipe servings in state
  model.updateServings(newServings);
  //update the recipe view
  /*  recipeView.render(model.state.recipe); */
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // Update recipe view
  recipeView.update(model.state.recipe);

  // render bookmarks
  bookmarksView.render(model.state.bookmarks);
};
// view your bookmarks
const controlAddBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipes = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();
    //upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // render recipe
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();

    //render bookmark view
    bookmarksView.render(model.state.bookmarks);
    // change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form window success message
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('🚩🚩🚩', err);
    addRecipeView.renderError(err.message);
  }
  //location.reload();
};

const newFeature = function () {
  console.log('Welcome to the application');
};

const init = function () {
  bookmarksView.addHandlerRender(controlAddBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHanlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  newFeature();
};
init();
