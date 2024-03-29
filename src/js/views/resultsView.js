import View from './View.js';
import previewView from './previewView.js';

class resultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No recipe found for the query please try again`;
  _Message = ``;

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new resultsView();
