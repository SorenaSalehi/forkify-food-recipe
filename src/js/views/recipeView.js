import Fraction from "fraction.js";
import View from "./views.js";
// console.log(Fraction);
import icons from "url:../../img/icons.svg";

class RecipeView extends View {
  _parentEl = document.querySelector(".recipe");
  _errorMessage = `We could Not find that Recipe ! Please Try another one OR check Your Input 😟`;
  _message = " ";

  //cm:windows hash changer listener
  //tip:here we have duplicated code,And we don't want it!
  // window.addEventListener('hashchange',controlRecipe)
  // window.addEventListener('load',controlRecipe)
  //new:SO we do that:
  // ['hashchange','load'].forEach(ev => window.addEventListener(ev,controlRecipe))
  //cm:publisher-subscriber pattern
  addHandlerRender(handler) {
    ["hashchange", "load"].forEach((ev) =>
      window.addEventListener(ev, handler),
    );
  }

  addHandlerControlServings(handler) {
    this._parentEl.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--update-servings");
      if (!btn) return;

      //NEW servings
      const updateTo = +btn.dataset.updateTo;

      //The update Logic
      if (updateTo > 0) handler(updateTo);
    });
  }

  //Add bookmark handler
  //tip:In this case the event dedication is necessary , because the element that we want to listen for it , when the page are loaded are not exist
  addHandlerAddBookmark(handler) {
    this._parentEl.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--bookmark");
      if (!btn) return;
      handler();
    });
  }

  //cm:Its (_)work because of babel
  _generateMarkup() {
    return ` <figure class="recipe__fig">
        <img src="${this._data.image}" alt="${
          this._data.title
        }" class="recipe__img" />
                        <h1 class="recipe__title">
                          <span>${this._data.title}</span>
                        </h1>
      </figure>

      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${
            this._data.cookingTime
          }</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${
            this._data.servings
          }</span>
          <span class="recipe__info-text">servings</span>

          <div class="recipe__info-buttons">
            <button data-update-to =" ${this._data.servings - 1}" class="btn--tiny btn--update-servings"  >
              <svg>
                <use href="${icons}#icon-minus-circle"></use>
              </svg>
            </button>
            <button  data-update-to =" ${this._data.servings + 1}" class="btn--tiny btn--update-servings"  >
              <svg>
                <use href="${icons}#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>

        <div class="recipe__user-generated hidden">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
        </div>
        <button class="btn--round btn--bookmark">
          <svg class="">
            <use href="${icons}#icon-bookmark${this._data.bookmark ? "-fill" : ""}"></use>
          </svg>
        </button>
      </div>

      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
        ${this._data.ingredients
          //cm:creating a new array whit these string and then join them
          .map((ing) => this._renderIngredients(ing))
          .join(" ")}
        </ul>
      </div>

      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${
            this._data.publisher
          }</span>. Please check out
          directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href="${this._data.sourceUrl}"
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </a>
      </div>
  `;
  }
  _renderIngredients(ing) {
    return `<li class="recipe__ingredient">
          <svg class="recipe__icon">
             <use href="${icons}#icon-check"></use>
        </svg>
                <div class="recipe__quantity">${
                  !ing.quantity
                    ? ""
                    : new Fraction(ing.quantity).toFraction(true)
                }</div>
                <div class="recipe__description">
          <span class="recipe__unit">${ing.unit}</span>
          ${ing.description}
        </div>
       </li>`;
  }
}

//We want to export one new object and can have any name that we want
export default new RecipeView();
