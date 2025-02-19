import { elements } from "./base";

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = "";
};

export const clearResults = () => {
  elements.searchResList.innerHTML = "";
  elements.searchResPages.innerHTML = "";
};

export const highlightSelected = (id) => {
  const resultsArr = Array.from(document.querySelectorAll(".results__link"));
  resultsArr.forEach((element) => {
    element.classList.remove("results__link--active");
  });
  document.querySelector(`.results__link[href*="${id}"]`).classList.add("results__link--active");
};

export const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(" ").reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    return `${newTitle.join(" ")} ...`;
  }
  return title;
};

const renderRecipe = (recipe) => {
  //Tip: After pasting in html code, press ctrl+z once to format the way it was in html file
  const markup = `
    <li>
      <a class="results__link" href="#${recipe.recipe_id}">
          <figure class="results__fig">
              <img src="${recipe.image_url}" alt="${recipe.title}">
          </figure>
          <div class="results__data">
              <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
              <p class="results__author">${recipe.publisher}</p>
          </div>
      </a>
    </li>
  `;
  elements.searchResList.insertAdjacentHTML("beforeend", markup);
};

// type: "prev" or "next"
const createButton = (page, type) => `
  <button class="btn-inline results__btn--${type}" data-goto=${type === "prev" ? page - 1 : page + 1}>
    <span>Page ${type === "prev" ? page - 1 : page + 1}</span>
    <svg class="search__icon">
      <use href="img/icons.svg#icon-triangle-${type === "prev" ? "left" : "right"}"></use>
    </svg>
  </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);
  let button;
  if (page === 1 && pages > 1) {
    // only show button to go next page
    button = createButton(page, "next");
  } else if (page < pages) {
    // show both buttons to go next & previous page
    button = `
      ${createButton(page, "next")}
      ${createButton(page, "prev")}
    `;
    /* The reason to write as above & not below because we want to create a set of html strings that consists of both the next & prev buttons in one variable of *button*. Then we use the *button* variable to insert into DOM. */
    // button = createButton(page, next);
    // button = createButton(page, prev);
  } else if (page === pages && pages > 1) {
    // only show button to go previous page
    button = createButton(page, "prev");
  }
  elements.searchResPages.insertAdjacentHTML("afterbegin", button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  // Render result pages
  // Below are math formulas for "start" & "end" to dynamically calculate result per page
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;
  recipes.slice(start, end).forEach(renderRecipe); //Slice method extracts up to but NOT including "end" index
  // Render button(s) for pages navigation
  renderButtons(page, recipes.length, resPerPage);
};
