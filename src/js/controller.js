//new:Importing All export from An model
import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js"; //cm:polyfill everything else
import addRecipeView from "./views/addRecipeView.js";
import "core-js/stable"; //cm:polyfill async await
import "regenerator-runtime/runtime";

//for not reload the entire page
// if(module.hot){module.hot.accept()}

// https://forkify-api.herokuapp.com/v2
const controlRecipe = async function () {
  //1.Loading recipe
  try {
    //new: getting the ID:
    //getting the hash and slice it from first letter(#)
    const id = window.location.hash.slice(1);

    //cm:guard clause
    if (!id) return;
    recipeView.renderSpinner();

    //updating bookmark
    bookmarksView.update(model.state.bookmark);

    //Now with update method  we're just updating the part has updated not all the page
    resultsView.update(model.getSearchResultsPage());

    //1.Loading recipe:
    //receive the ID from window hash
    //tip:it will come from an async function and will be a promise ,and we should await it:
    await model.roadRecipe(id);
    // console.log(recipe);

    //2.Rendering recipe
    //receive data from model
    console.log(model.state.recipe);
    recipeView.render(model.state.recipe);
  } catch (error) {
    // console.log(error);
    recipeView.renderError();
  }
};

//This will not return anything , so we don't store it
const controlSearchResult = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    //receive the search value and pass to the model for fetching data
    await model.loadSearchResult(query);
    // resultsView.render(model.state.search.result)
    resultsView.render(model.getSearchResultsPage());
    //render initial pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

//control pagination
const controlPagination = function (goToPage) {
  // console.log(goToPage);
  //accept the page number by dataset and pass it to the search result page
  //render New result
  resultsView.render(model.getSearchResultsPage(goToPage));
  //render New pagination
  paginationView.render(model.state.search);
};

//control servings
const controlServings = function (newServing) {
  //updating servings
  model.updateServings(newServing);

  //updating recipe view
  // recipeView.render(model.state.recipe)
  recipeView.update(model.state.recipe);
};

//control Add Bookmark
const controlAddBookmark = function () {
  //if there are an bookmark deleted else adding bookmark
  //Add/Remove bookmark
  if (!model.state.recipe.bookmark) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // console.log(model.state.recipe);
  recipeView.update(model.state.recipe);
};

//control render bookmark
const controlBookmark = function () {
  bookmarksView.render(model.state.bookmark);
};

//control add recipe
const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    //This Error will come from the model NOT controller
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

///////////////////////////////////////

//new:instated of this,we should use in MVC:The publisher-subscriber pattern
const init = function () {
  //handler bookmark
  bookmarksView.addHandlerRender(controlBookmark);
  //handler the recipe view
  recipeView.addHandlerRender(controlRecipe);
  //handler teh servings view
  recipeView.addHandlerControlServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  //handler the search field
  searchView.addHandlerSearch(controlSearchResult);
  //handler the pagination
  paginationView.addHandlerPage(controlPagination);
  //handler add recipe
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
