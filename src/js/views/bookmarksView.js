//import View from './View.js';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';

class bookmarksView extends previewView {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it';
  _message = '';
  ///////render from local store
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
}

export default new bookmarksView();
