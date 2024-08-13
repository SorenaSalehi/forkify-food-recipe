import icons from "url:../../img/icons.svg";

import View from "./views.js";

//extending view
class ResultsView extends View{
    _parentEl = document.querySelector('.results')
    _errorMessage= `No Recipe Found For Your Query , Please Try  Again  😟`;
  _message=' ';
  



    _generateMarkup(){
        // console.log(this._data);
        return this._data.map(this._generateMarkupPreview).join(' ')
    }
    _generateMarkupPreview(result){
        const id=window.location.hash.slice(1)
        return  `
                <li class="preview">
                        <a class="preview__link ${result.id === id ? "preview__link--active" : ''}" href="#${result.id}">
                        <figure class="preview__fig">
                            <img src="${result.image}" alt="${result.title}" />
                        </figure>
                        <div class="preview__data">
                            <h4 class="preview__title">${result.title}</h4>
                            <p class="preview__publisher">The Pioneer Woman</p>
                            
                        </div>
                        </a>
                    </li>
        `
    }
}
//create new object
export default new ResultsView()