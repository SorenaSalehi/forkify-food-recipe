import icons from "url:../../img/icons.svg";
// console.log(icons);

//new:This will be THe parent class
//tip:So we export it immediately
//cm:Because we dont want to create any instance ,  we will only use it as a parent class

export default class View {
  _data;
  //cm:we want to our code be usable not just one time

  //cm:An common name:
  render(data) {

    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }


//new:update method should just update the part of html that change Not entire page
  update(data) {
    this._data = data
    //cm:If the result are rejected, stile we have a result but An empty Array:
    //  if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();


    //tip: this will compare to the current markup and change if it needs
    const newMarkup = this._generateMarkup()

    //new:this is the method we need it:(this will create a virtual dom object)
    const dom = document.createRange().createContextualFragment(newMarkup)
    //new:and with this we can see that new Markup
    //cm:these are node list , so we use Array.from
    const newElement = Array.from(dom.querySelectorAll('*'))
    const curElement = Array.from(this._parentEl.querySelectorAll('*'))

    //new:comparing 2 Array:
    newElement.forEach((newEl, i) => {
      const curEl = curElement[i]

      //new:And we have a method for compare to node list:
      //cm:If there happen a change, will return false
      // console.log(curEl , newEl.isEqualNode(curEl) );

      //So changing the dom:

      //new:newEl.firstChild.nodeValue : Are taking the text inside the element
      //And check the text should not be empty

      //Update changed Text
      if (!curEl.isEqualNode(newEl) && newEl.firstChild?.nodeValue.trim() !== '') {

        curEl.textContent = newEl.textContent


      }

      //Update changed Attribute:
      //new:For this we also another cool method to check the element attributes
      if (!curEl.isEqualNode(newEl)) {
        //Looping over the curEl and set the newEl Attributes to the curEl using the (setAttributes) method
        Array.from(newEl.attributes).forEach(attr => {
          // console.log(Array.from(newEl.attributes));
          curEl.setAttribute(attr.name, attr.value)
        })
      }


    })

  }

  renderSpinner() {
    const markup = ` <div class="spinner">
                                        <svg>
                                          <use href="${icons}#icon-loader"></use>
                                        </svg>
                                  </div> `;

    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  //Global function
  _clear() {
    this._parentEl.innerHTML = " ";
  }

  renderError(message = this._errorMessage) {
    const markup = `
              <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>
      `;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  addMessage(message = this._message) {
    const markup = `
              <div class="message">
              <div>
                <svg>
                  <use href="${icons}_icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>
      `;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }}


