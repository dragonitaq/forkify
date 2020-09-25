import { elements } from "./base";
import fracty from "fracty";

export const clearRecipe = () => {
  elements.recipe.innerHTML = "";
};

const formatCount = (count) => {
  if (count) {
    // const newCount = Math.round(count * 10000) / 10000;
    return `${fracty(count)}`;
  }
  return "?";
};
/* Pizza Dip (#2ec050) will get "?" or "undefined" value.
Because there are strings like " teaspoon dried basil" where there is space at the beginning of the sentence.
When we do "const arrIng = ingredient.split(" ");" in Recipe.js, it creates an empty element (null) in the first position of the array.
This will create undesired result when we run "const arrCount = arrIng.slice(0, unitIndex);".
Which will then result in "?" or "undefined" value. */

export const createIngredient = (ingredient) => `
  <li class="recipe__item">
    <svg class="recipe__icon">
      <use href="img/icons.svg#icon-check"></use>
    </svg>
    <div class="recipe__count">${formatCount(ingredient.count)}</div>
    <div class="recipe__ingredient">
      <span class="recipe__unit">${ingredient.unit}</span>
      ${ingredient.ingredient}
    </div>
  </li>
`;

export const renderRecipe = (recipe, isLiked) => {
  const markup = `
    <figure class="recipe__fig">
        <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
        <h1 class="recipe__title">
            <span>${recipe.title}</span>
        </h1>
    </figure>

    <div class="recipe__details">
        <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="img/icons.svg#icon-stopwatch"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
            <span class="recipe__info-text"> minutes</span>
        </div>
        <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="img/icons.svg#icon-man"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
            <span class="recipe__info-text"> servings</span>

            <div class="recipe__info-buttons">
                <button class="btn-tiny btn-decrease">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-minus"></use>
                    </svg>
                </button>
                <button class="btn-tiny btn-increase">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-plus"></use>
                    </svg>
                </button>
            </div>
        </div>
        <button class="recipe__love">
            <svg class="header__likes">
                <use href="img/icons.svg#${isLiked ? "icon-heart" : "icon-heart-outlined"}"></use>
            </svg>
        </button>
    </div>

    <div class="recipe__ingredients">
        <ul class="recipe__ingredient-list">
            ${recipe.ingredients.map((element) => createIngredient(element)).join("")}
        </ul>

        <button class="btn-small recipe__btn recipe__btn--add">
            <svg class="search__icon">
                <use href="img/icons.svg#icon-shopping-cart"></use>
            </svg>
            <span>Add to shopping list</span>
        </button>
    </div>

    <div class="recipe__directions">
        <h2 class="heading-2">How to cook it</h2>
        <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
        </p>
        <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
            <span>Directions</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-right"></use>
            </svg>

        </a>
    </div>
  `;
  elements.recipe.insertAdjacentHTML("afterbegin", markup);
};

export const updateServingsIngredients = (recipe) => {
  // Update servings display number
  document.querySelector(".recipe__info-data--people").textContent = recipe.servings;
  // Update ingredient display count
  const countElements = Array.from(document.querySelectorAll(".recipe__count"));
  countElements.forEach((element, i) => {
    element.textContent = formatCount(recipe.ingredients[i].count);
  });
};
