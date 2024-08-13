import  icons  from "url:../../img/icons.svg";
import View from "./views.js";

//Number of  pages
class PaginationViews extends View {
  _parentEl = document.querySelector(".pagination");

  //click handler
  addHandlerPage(handler){
    this._parentEl.addEventListener('click',function(e){
      const btn = e.target.closest('.btn--inline')
      // console.log(btn);
      if(!btn) return ;

      //get the data number and pass it to handler
      const goToPage = +btn.dataset.goto
      // console.log(goToPage);
      handler(goToPage)
    })
  }


  _generateMarkup() {
    const curPage = this._data.page;
    //The number of result / resultpage variables from config.js
    const numPage = Math.ceil(this._data.result.length / this._data.resultPage);
    // console.log(numPage);

    //1.page 1 , and there are other page
    if (curPage === 1 && numPage > 1) {
        //cm:this will show the number of next page (current page + 1 )

        //cm:Now we can with data attribute , find our page to handle the Btns
      return `
                 <button data-goto = "${curPage + 1 }  " class="btn--inline pagination__btn--next">
                        <span>Page ${curPage + 1 } </span>
                        <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                        </svg>
                </button>
      `;
    }

    //2.Last page
    if (curPage === numPage && numPage > 1) {
        //cm:this will show the number of last page
      return `
                 <button data-goto = "${curPage - 1 }  " class="btn--inline pagination__btn--prev">
                        <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                        </svg>
                        <span> Page ${curPage - 1 }</span>
                 </button>
      `;
    }

    //3.Other page
    if (curPage < numPage) {
        //cm will show the button
      return `
                  <button data-goto = "${curPage + 1 }  " class="btn--inline pagination__btn--next">
                        <span>Page ${curPage + 1 }</span>
                        <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                        </svg>
                </button>

                <button data-goto = "${curPage - 1 }  " class="btn--inline pagination__btn--prev">
                        <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                        </svg>
                        <span>Page ${curPage - 1 }</span>
                 </button>
      `;
    }
    //4.page1 , and there are not other page
    return " ";
  }
}

export default new PaginationViews();
