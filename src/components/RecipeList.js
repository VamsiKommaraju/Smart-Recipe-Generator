import React from 'react';
import { Clock, Users, Heart, ChefHat } from 'lucide-react';

const RecipeList = ({ 
  recipes, 
  loading, 
  onRecipeSelect, 
  favorites, 
  ratings, 
  onToggleFavorite, 
  onRating 
}) => {
  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        Finding the perfect recipes for you...
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🍽️</div>
        <h3 className="empty-state-title">No recipes found</h3>
        <p className="empty-state-description">
          Try adjusting your ingredients or filters to find more recipes.
        </p>
      </div>
    );
  }

  const renderStars = (recipeId, currentRating) => {
    return (
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= currentRating ? 'filled' : ''}`}
            onClick={() => onRating(recipeId, star)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="recipe-list">
      {recipes.map((recipe) => (
        <div
          key={recipe.id}
          className="recipe-card"
          onClick={() => onRecipeSelect(recipe)}
        >
          <img
            src={recipe.image}
            alt={recipe.name}
            className="recipe-image"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
            }}
          />
          
          <div className="recipe-content">
            <div className="recipe-header">
              <div>
                <h3 className="recipe-title">{recipe.name}</h3>
                <p className="recipe-cuisine">{recipe.cuisine}</p>
              </div>
              {recipe.matchScore && (
                <div className="match-score">
                  {Math.round(recipe.matchScore)}% match
                </div>
              )}
            </div>

            <div className="recipe-meta">
              <span>
                <Clock size={14} />
                {recipe.cookingTime} min
              </span>
              <span>
                <Users size={14} />
                {recipe.servings} servings
              </span>
              <span>
                <ChefHat size={14} />
                {recipe.difficulty}
              </span>
            </div>

            <div className="recipe-description">
              {recipe.ingredients.slice(0, 3).join(', ')}
              {recipe.ingredients.length > 3 && ` +${recipe.ingredients.length - 3} more`}
            </div>

            <div className="recipe-tags">
              {recipe.dietaryTags.slice(0, 3).map((tag, index) => (
                <span key={index} className="recipe-tag">
                  {tag.replace('-', ' ')}
                </span>
              ))}
            </div>

            <div className="recipe-actions">
              <div className="recipe-stats">
                <span>{recipe.nutritionalInfo.calories} cal</span>
                <span>{recipe.nutritionalInfo.protein}g protein</span>
              </div>
              
              <div className="recipe-actions-right">
                <button
                  className={`favorite-btn ${favorites.includes(recipe.id) ? 'favorited' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(recipe.id);
                  }}
                  title={favorites.includes(recipe.id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart 
                    size={18} 
                    fill={favorites.includes(recipe.id) ? 'currentColor' : 'none'}
                  />
                </button>
                
                <div onClick={(e) => e.stopPropagation()}>
                  {renderStars(recipe.id, ratings[recipe.id] || 0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecipeList;
