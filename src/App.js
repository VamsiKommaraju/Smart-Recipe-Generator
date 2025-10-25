import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Header from './components/Header';
import IngredientInput from './components/IngredientInput';
import FilterPanel from './components/FilterPanel';
import RecipeList from './components/RecipeList';
import RecipeModal from './components/RecipeModal';
import { recipes, commonIngredients, dietaryOptions, difficultyLevels, cuisineTypes } from './data/recipes';

function App() {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState(recipes);
  const [filters, setFilters] = useState({
    dietary: [],
    difficulty: [],
    cuisine: [],
    maxCookingTime: 120,
    maxCalories: 1000
  });
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(false);
  const [servingSize, setServingSize] = useState(4);

  // Load favorites and ratings from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('recipeFavorites');
    const savedRatings = localStorage.getItem('recipeRatings');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    if (savedRatings) {
      setRatings(JSON.parse(savedRatings));
    }
  }, []);

  // Save favorites and ratings to localStorage
  useEffect(() => {
    localStorage.setItem('recipeFavorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('recipeRatings', JSON.stringify(ratings));
  }, [ratings]);

  // Enhanced recipe matching algorithm with better uncommon ingredient support
  const findMatchingRecipes = useCallback((ingredients, recipeList) => {
    if (ingredients.length === 0) return recipeList;

    return recipeList.map(recipe => {
      const matchingIngredients = recipe.ingredients.filter(ingredient =>
        ingredients.some(selectedIngredient => {
          const ingredientLower = ingredient.toLowerCase();
          const selectedLower = selectedIngredient.toLowerCase();
          
          // Exact match
          if (ingredientLower === selectedLower) return true;
          
          // Contains match (both directions)
          if (ingredientLower.includes(selectedLower) || selectedLower.includes(ingredientLower)) return true;
          
          // Word boundary match for compound ingredients
          const ingredientWords = ingredientLower.split(/[\s,-]+/);
          const selectedWords = selectedLower.split(/[\s,-]+/);
          
          return ingredientWords.some(word => 
            selectedWords.some(selectedWord => 
              word.includes(selectedWord) || selectedWord.includes(word)
            )
          );
        })
      );

      const matchScore = (matchingIngredients.length / recipe.ingredients.length) * 100;
      const hasAllIngredients = matchingIngredients.length === recipe.ingredients.length;
      const partialMatch = matchingIngredients.length > 0;

      return {
        ...recipe,
        matchScore,
        hasAllIngredients,
        partialMatch,
        matchingIngredients
      };
    }).sort((a, b) => {
      // Prioritize recipes with all ingredients, then partial matches, then by match score
      if (a.hasAllIngredients && !b.hasAllIngredients) return -1;
      if (!a.hasAllIngredients && b.hasAllIngredients) return 1;
      if (a.partialMatch && !b.partialMatch) return -1;
      if (!a.partialMatch && b.partialMatch) return 1;
      return b.matchScore - a.matchScore;
    });
  }, []);

  // Apply filters
  const applyFilters = useCallback((recipeList) => {
    return recipeList.filter(recipe => {
      // Dietary filters
      if (filters.dietary.length > 0) {
        const hasDietaryMatch = filters.dietary.some(dietary =>
          recipe.dietaryTags.includes(dietary)
        );
        if (!hasDietaryMatch) return false;
      }

      // Difficulty filter
      if (filters.difficulty.length > 0) {
        if (!filters.difficulty.includes(recipe.difficulty)) return false;
      }

      // Cuisine filter
      if (filters.cuisine.length > 0) {
        if (!filters.cuisine.includes(recipe.cuisine)) return false;
      }

      // Cooking time filter
      if (recipe.cookingTime > filters.maxCookingTime) return false;

      // Calories filter
      if (recipe.nutritionalInfo.calories > filters.maxCalories) return false;

      return true;
    });
  }, [filters]);

  // Update filtered recipes when ingredients or filters change
  useEffect(() => {
    setLoading(true);
    
    setTimeout(() => {
      let matchedRecipes = findMatchingRecipes(selectedIngredients, recipes);
      matchedRecipes = applyFilters(matchedRecipes);
      setFilteredRecipes(matchedRecipes);
      setLoading(false);
    }, 500);
  }, [selectedIngredients, filters, findMatchingRecipes, applyFilters]);

  const handleIngredientAdd = (ingredient) => {
    if (!selectedIngredients.includes(ingredient)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  const handleIngredientRemove = (ingredient) => {
    setSelectedIngredients(selectedIngredients.filter(ing => ing !== ingredient));
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleRecipeSelect = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleCloseModal = () => {
    setSelectedRecipe(null);
  };

  const handleToggleFavorite = (recipeId) => {
    setFavorites(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const handleRating = (recipeId, rating) => {
    setRatings(prev => ({
      ...prev,
      [recipeId]: rating
    }));
  };

  const getSubstitutionSuggestions = (recipe) => {
    const substitutions = {
      'chicken': ['tofu', 'tempeh', 'mushrooms'],
      'beef': ['lentils', 'mushrooms', 'beans'],
      'dairy': ['coconut milk', 'almond milk', 'cashew cream'],
      'eggs': ['flax eggs', 'chia eggs', 'applesauce'],
      'wheat': ['rice flour', 'almond flour', 'coconut flour']
    };

    return Object.entries(substitutions).filter(([key, values]) =>
      recipe.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(key)
      )
    ).map(([key, values]) => ({ ingredient: key, alternatives: values }));
  };

  const adjustServingSize = (recipe, newServingSize) => {
    const ratio = newServingSize / recipe.servings;
    return {
      ...recipe,
      servings: newServingSize,
      nutritionalInfo: {
        calories: Math.round(recipe.nutritionalInfo.calories * ratio),
        protein: Math.round(recipe.nutritionalInfo.protein * ratio * 10) / 10,
        carbs: Math.round(recipe.nutritionalInfo.carbs * ratio * 10) / 10,
        fat: Math.round(recipe.nutritionalInfo.fat * ratio * 10) / 10
      }
    };
  };

  const handleServingSizeChange = (newSize) => {
    setServingSize(newSize);
    if (selectedRecipe) {
      setSelectedRecipe(adjustServingSize(selectedRecipe, newSize));
    }
  };

  return (
    <div className="App">
      <Header />
      
      <main className="main-content">
        <div className="container">
          <div className="input-section">
            <IngredientInput
              selectedIngredients={selectedIngredients}
              onIngredientAdd={handleIngredientAdd}
              onIngredientRemove={handleIngredientRemove}
              commonIngredients={commonIngredients}
            />
          </div>

          <div className="content-grid">
            <div className="filters-column">
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                dietaryOptions={dietaryOptions}
                difficultyLevels={difficultyLevels}
                cuisineTypes={cuisineTypes}
              />
            </div>

            <div className="recipes-column">
              <RecipeList
                recipes={filteredRecipes}
                loading={loading}
                onRecipeSelect={handleRecipeSelect}
                favorites={favorites}
                ratings={ratings}
                onToggleFavorite={handleToggleFavorite}
                onRating={handleRating}
              />
            </div>
          </div>
        </div>
      </main>

      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={handleCloseModal}
          isFavorite={favorites.includes(selectedRecipe.id)}
          rating={ratings[selectedRecipe.id] || 0}
          onToggleFavorite={handleToggleFavorite}
          onRating={handleRating}
          substitutionSuggestions={getSubstitutionSuggestions(selectedRecipe)}
          servingSize={servingSize}
          onServingSizeChange={handleServingSizeChange}
        />
      )}
    </div>
  );
}

export default App;
