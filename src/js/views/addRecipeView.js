import View from "./views.js";
import  icons  from "url:../../img/icons.svg";

//Number of  pages
class addRecipeViews extends View {
  _parentEl = document.querySelector(".upload");
  _btnOpen = document.querySelector('.nav__btn--add-recipe')
  _window=document.querySelector('.add-recipe-window')
  _btnClose = document.querySelector('.btn--close-modal')
  _overlay=document.querySelector('.overlay')

  //we want to use this class immediately , so we do that And this will run As soon as this object created
  //And this is just show and hide modal , So we don't want to add it to the controller
  constructor() {
    super();
    this._addHandlerShowWindow()
    this._addHandlerCloseWindow()
  }


  //toggle hidden class
  _toggleClass(){
    this._overlay.classList.toggle('hidden')
    this._window.classList.toggle('hidden')
  }

  //here we're using event listener, so we're can't use directly this keyword
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click',this._toggleClass.bind(this))
  }

  //handler hide window
  _addHandlerCloseWindow(){
    this._btnClose.addEventListener('click',this._toggleClass.bind(this))
    this._overlay.addEventListener('click',this._toggleClass.bind(this))
  }

  //handler upload
  addHandlerUpload(handler){
    this._parentEl.addEventListener('submit',function (e){
      e.preventDefault()
      //we can select All element one by one,
      //but we have a new method for the form
      //cm::this method receive a form And in this case our form is the parent element , which is this keyword
      //cm::it will return a weird object , but we put it in the array and spreed it
      const dataArr = [...new FormData(this)]//new we have an entry array

      //make it object with the very nice 2019 method:
      const data = Object.fromEntries(dataArr)
      handler(data)
    })
  }

  _generateMarkup(){}
}

export default new addRecipeViews();
