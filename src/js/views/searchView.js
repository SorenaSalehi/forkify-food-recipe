import View from "./views.js";

class SearchView extends View {
    _parentEl = document.querySelector('.search')

    //get query from searchh field
    getQuery(){
        const query =  this._parentEl.querySelector('.search__field').value;
        this._clearField();
        return  query;
    }

    //clear field
    _clearField(){
        this._parentEl.querySelector('.search__field').value = ' ';
        this._parentEl.querySelector('.search__field').blur();
    }


    //handler  the submit search
    addHandlerSearch(handler){
        this._parentEl.addEventListener('submit',function(e){
            e.preventDefault()
            handler()
        })
    }

}

export default new SearchView()