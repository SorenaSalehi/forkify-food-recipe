import { API_URL, RES_PER_PAGE, KEY } from "./config.js";
// import {getJson, sendJson} from "./helpers.js";
import { AJAX } from "./helpers.js";

//cm:and this will work globally
//cm:Here Will Be the Most Impotent Data
export const state = {
  recipe: {},
  search: {
    query: "",
    result: [],
    page: 1,
    resultPage: RES_PER_PAGE,
  },
  bookmark: [],
};

//refactoring:
//create recipe object
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

//get the api object with api url and ip
//cm:this will not return anything , All it will do, is the change the state object
export const roadRecipe = async function (id) {
  try {
    //cm:refactor it
    // const res = await fetch(
    //     `${API_URL}/${id}`
    //     // `https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886`
    //   );
    // //   console.log(res);
    //   // console.log(res);
    //   const data = await res.json();
    //   // console.log(data);
    //   if (!res.ok) throw new Error(`${data.message} : ${data.status}`);
    //cm:We await for this promise
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    //cm:construct it
    // const { recipe } = data.data;
    // // console.log(data);
    // //cm:changing the key And put in the state.recipe
    // state.recipe = {
    //   publisher: recipe.publisher,
    //   ingredients: recipe.ingredients,
    //   sourceUrl: recipe.source_url,
    //   image: recipe.image_url,
    //   title: recipe.title,
    //   servings: recipe.servings,
    //   cookingTime: recipe.cooking_time,
    //   id: recipe.id,
    // };
    state.recipe = createRecipeObject(data);

    //cm:Solving the problem which is not store the bookmarks
    //cm:Using the some(any) method , which will return true or false if there are anything are same the condition
    if (state.bookmark.some((bookmark) => bookmark.id === id))
      state.recipe.bookmark = true;
    else state.recipe.bookmark = false;

    // console.log(state.recipe);
  } catch (error) {
    // console.error(`${error} 💥💥💥💥💥💥`);

    //cm:Here also we should rethrow the error
    throw `${error} 💥💥💥💥💥💥`;
  }
};

//loading search result from search query and creat new object
export const loadSearchResult = async function (query) {
  try {
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    //IN each iteration it will create an array with these value in the state
    state.search.result = data.data.recipes.map((rec) => {
      return {
        publisher: rec.publisher,
        image: rec.image_url,
        title: rec.title,
        id: rec.id,
        ...(rec.key && { key: rec.key }),
      };
    });
    //reset the page
    state.search.page = 1;
  } catch (err) {
    throw `${err} 💥💥💥💥💥💥`;
  }
};

//get number of page from search result
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  //tip:if the page are 1 , soo (1 - 1 = 0) then  (0 * 10) = 0
  const start = (page - 1) * state.search.resultPage; //0
  const end = page * state.search.resultPage; //10

  //cm:As the Arrays are 0 base and slice don't take the last index , we pass the 0 to 10 Aaaaaaaand get the index 0 to 9
  return state.search.result.slice(start, end);
};

//update serving model
export const updateServings = function (NewServing) {
  //cm: newQuantity : oldQuantity * newServing / oldServing
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * NewServing) / state.recipe.servings;
  });

  //update the new serving
  state.recipe.servings = NewServing;
};

//Local storage:
//we do not need to export it
const persistBookmark = function () {
  //set the name of storage and make the data stringify
  localStorage.setItem("bookmark", JSON.stringify(state.bookmark));
};

//As bookmark, it will receive a recipe and save it
export const addBookmark = function (recipe) {
  //Add the recipe bookmark
  state.bookmark.push(recipe);

  //Mark correct recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmark = true;

  persistBookmark();
};

//cm:this is very common that when we add data we're adding entire data , but when we're deleting ,
// we get just id(unique)
//It will receive an id and delete it from bookmark
export const deleteBookmark = function (id) {
  //delete bookmark

  //create index : bookmark id must be equal to passing id
  const index = state.bookmark.findIndex((index) => index.id === id);

  //remove from array
  state.bookmark.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmark = false;

  persistBookmark();
};

//initial function for getting the local storage:
const init = function () {
  //get data
  const storage = localStorage.getItem("bookmark");
  //if is it exist , parse it and store it
  if (storage) state.bookmark = JSON.parse(storage);
};
init();

//Sending the data to the API
//cm:It must be exactly like the data that come from api
export const uploadRecipe = async function (newRecipe) {
  try {
    //1.Make it entry
    const ingredients = Object.entries(newRecipe)
      //2.filter the ingredient except the empty ones
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ing) => {
        //3.cut any white space and split hem with comma
        const ingArr = ing[1].split(",").map((el) => el.trim());
        //4.Error handling:
        if (ingArr.length !== 3) {
          throw Error(
            "Wrong ingredient format! Please use the correct format :)",
          );
        }

        //5.Destructuring:
        const [quantity, unit, description] = ingArr;

        //6.if quantity are exist than convert to number
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    //creating the recipe:
    //cm:Its opposite of taking data from API
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    console.log(recipe);
    //send the request and store the response
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    console.error("💥💥", err);
    throw err;
  }
};
