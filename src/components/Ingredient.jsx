import React, { useState, useEffect } from "react";
import "./Ingredient.css"; // Import the updated CSS file

export default function Ingredient() {
  const [ingredients, setIngredients] = useState(["", "", "", "", ""]);
  const [recipeResults, setRecipeResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleIngredientChange = (event, index) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = event.target.value;
    setIngredients(updatedIngredients);
  };

  const handleFormSubmit = (event, index) => {
    event.preventDefault();
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = event.target.value;
    setIngredients(updatedIngredients);
    setShowResults(true);
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      if (showResults) {
        const nonEmptyIngredients = ingredients.filter(
          (ingredient) => ingredient.trim() !== ""
        );

        if (nonEmptyIngredients.length > 0) {
          let url = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=3005be7dd36545f0a1cb03784da22e5f&ingredients=${nonEmptyIngredients.join(
            ","
          )}&number=6`;

          const response = await fetch(url);

          if (response.ok) {
            const data = await response.json();
            setRecipeResults(data);
          }
        } else {
          setRecipeResults([]);
        }
      }
    };

    fetchRecipes();
  }, [ingredients, showResults]);

  return (
    <div className="container">
      <h1 className="header">RECIPE GENERATOR</h1>
      <form className="form" onSubmit={handleFormSubmit}>
        {ingredients.map((ingredient, index) => (
          <div className="input-container" key={index}>
            <label htmlFor={`ing${index + 1}`} className="input-label">
              Ingredient {index + 1}
            </label>
            <input
              type="text"
              id={`ing${index + 1}`}
              name={`ing${index + 1}`}
              placeholder={`Enter ingredient ${index + 1}`}
              value={ingredient}
              onChange={(event) => handleIngredientChange(event, index)}
              className="input-field"
            />
          </div>
        ))}
        <button
          type="submit"
          className="submit-button"
          onSubmit={handleFormSubmit}
        >
          Generate Recipes
        </button>
      </form>

      {showResults && (
        <div className="results">
          {recipeResults.map((recipe, index) => (
            <div className="recipe" key={index}>
              <h2 className="recipe-title">{recipe.title}</h2>
              <img
                src={recipe.image}
                alt={recipe.title}
                className="recipe-image"
              />
              <div className="recipe-details">
                {recipe.instructions && (
                  <>
                    <h3 className="subheading">Instructions:</h3>
                    <p className="recipe-instructions">{recipe.instructions}</p>
                  </>
                )}
                {recipe.missedIngredients && (
                  <>
                    <h3 className="subheading">Additional Ingredients:</h3>
                    <ul className="additional-ingredients">
                      {recipe.missedIngredients.map((ingredient, idx) => (
                        <li key={idx}>{ingredient.originalName}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
