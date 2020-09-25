/* ########################################################################## */
/*                                Model Recipe                                */
/* ########################################################################## */

// Go http://forkify-api.herokuapp.com/ for api documentation

import axios from "axios";

export default class Recipe {
  constructor(id) {
    this.id = id;
  }
  async getRecipe() {
    try {
      const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (error) {
      console.log(error);
    }
  }
  calcTime() {
    // We assume for every 3 ingredients, we need 15 minute
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }
  calcServing() {
    this.servings = 4;
  }
  parseIngredients() {
    const unitsLong = ["tablespoons", "tablespoon", "ounces", "ounce", "teaspoons", "teaspoon", "cups", "pounds", "grams", "gram", "kilograms", "kilogram"];
    const unitsShort = ["tbsp", "tbsp", "oz", "oz", "tsp", "tsp", "cup", "pound", "g", "g", "kg", "kg"];
    //Code below is less effective.
    // const unitsLong = ["tablespoons", "tablespoon", "ounces", "ounce", "teaspoons", "teaspoon", "cups", "pounds"];
    // const unitsShort = ["tbsp", "tbsp", "oz", "oz", "tsp", "tsp", "cup", "pound"];
    // const units = [...unitsShort, "g", "kg"];

    const newIngredients = this.ingredients.map((element) => {
      // 1) Unify ingredient units
      let ingredient = element.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });
      // 2) Remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");
      // 3) Parse ingredients into count, unit & ingredient
      const arrIng = ingredient.split(" ");
      // Find if the ingredient array consists of unit string
      const unitIndex = arrIng.findIndex((element2) => unitsShort.includes(element2));

      let objIng;
      if (unitIndex > -1) {
        // There is unit
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if (arrCount.length === 1) {
          // Eg. "4 cup", arrIng[0] will be [4] -> eval("4") -> 4
          // Eg. "1-1/3 cup", arrIng[0] will be [1-1/3] -> "1+1/3" -> eval(1+1/3) -> 1.333
          // If replace method couldn't find the specified string to replace, it simply returns the original string
          count = eval(arrIng[0].replace("-", "+"));
        } else {
          // Eg. "4 1/2 cup", arrCount will be [4, 1/2] -> "4+1/2"--> eval("4+1/2") -> 4.5
          count = eval(arrCount.join("+"));
        }
        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(" "),
        };
      } else if (parseInt(arrIng[0], 10)) {
        // There is no unit but start with number
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: "",
          ingredient: arrIng.slice(1).join(" "),
        };
      } else if (unitIndex === -1) {
        // There is no unit & no number
        objIng = {
          count: 1,
          unit: "",
          ingredient, // This equal to writing as: ingredient = ingredient;
        };
      }

      return objIng; // MUST return, if not will get undefined
    });
    this.ingredients = newIngredients;
  }
  updateServings(type) {
    //Servings
    const newServings = type === "dec" ? this.servings - 1 : this.servings + 1;
    //Above tells us we can use if statement (Ternary Operator) to assign variable.
    // Ingredients
    this.ingredients.forEach((ing) => {
      ing.count *= newServings / this.servings;
    });
    return (this.servings = newServings);
  }
}
