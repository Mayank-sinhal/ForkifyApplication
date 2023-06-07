import * as model from './model.js';
import receipeView from './views/receipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept;
// }

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    receipeView.renderSpinner();

    //0 upadate resulsts view
    resultsView.update(model.getSearchResultPage());
    bookmarksView.update(model.state.bookmarks);

    // 1. loading receipe
    await model.loadRecipe(id);

    // 2. rendering recipe
    receipeView.render(model.state.recipe);
  } catch (err) {
    receipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1. get query
    const query = searchView.getQuery();
    if (!query) return;
    //2. load search results
    await model.loadSearchResult(query);

    // render sesults
    resultsView.render(model.getSearchResultPage());

    //4. render pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goTOPage) {
  resultsView.render(model.getSearchResultPage(goTOPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the recipe servings (in state)

  model.updateServings(newServings);

  // update the recipe View
  // receipeView.render(model.state.recipe);
  receipeView.update(model.state.recipe);
};

const controlAddBookMark = function () {
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else model.deleteBookMark(model.state.recipe.id);
  //update view
  receipeView.update(model.state.recipe);
  //render
  bookmarksView.render(model.state.bookmarks);
};

const controlBookMark = function () {
  bookmarksView.render(model.state.bookmarks);
};
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading spinner
    addRecipeView.renderSpinner();

    //upload recipe
    await model.uploadRecipe(newRecipe);

    //render recipee
    receipeView.render(model.state.recipe);

    //sucess message
    addRecipeView.renderMessage();

    //remder bookmarksview

    bookmarksView.render(model.state.bookmarks);

    //chamge id in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form windows
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookMark);
  receipeView.addHandlerRender(controlRecipe);
  receipeView.addaHandlerUpdateServings(controlServings);
  receipeView.addHandlerAddBookmark(controlAddBookMark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
