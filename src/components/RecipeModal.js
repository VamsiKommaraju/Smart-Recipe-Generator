import React from 'react';
import { X, Heart } from 'lucide-react';

const RecipeModal = ({ 
  recipe, 
  onClose, 
  isFavorite, 
  rating, 
  onToggleFavorite, 
  onRating,
  substitutionSuggestions 
}) => {
  const renderStars = (currentRating) => {
    return (
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= currentRating ? 'filled' : ''}`}
            onClick={() => onRating(recipe.id, star)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{recipe.name}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <img
            src={recipe.image}
            alt={recipe.name}
            className="recipe-detail-image"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
            }}
          />

          <div className="recipe-detail-meta">
            <div className="meta-item">
              <div className="meta-value">{recipe.cookingTime}</div>
              <div className="meta-label">Minutes</div>
            </div>
            <div className="meta-item">
              <div className="meta-value">{recipe.servings}</div>
              <div className="meta-label">Servings</div>
            </div>
            <div className="meta-item">
              <div className="meta-value">{recipe.difficulty}</div>
              <div className="meta-label">Difficulty</div>
            </div>
            <div className="meta-item">
              <div className="meta-value">{recipe.cuisine}</div>
              <div className="meta-label">Cuisine</div>
            </div>
          </div>

          <div className="recipe-sections">
            {/* Ingredients */}
            <div className="recipe-section">
              <h3 className="section-title">Ingredients</h3>
              <div className="ingredients-list">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="ingredient-item">
                    {ingredient}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="recipe-section">
              <h3 className="section-title">Instructions</h3>
              <div className="instructions-list">
                {recipe.instructions.map((instruction, index) => (
                  <div key={index} className="instruction-item">
                    {instruction}
                  </div>
                ))}
              </div>
            </div>

            {/* Nutritional Information */}
            <div className="recipe-section">
              <h3 className="section-title">Nutritional Information</h3>
              <div className="nutrition-grid">
                <div className="nutrition-item">
                  <div className="nutrition-value">{recipe.nutritionalInfo.calories}</div>
                  <div className="nutrition-label">Calories</div>
                </div>
                <div className="nutrition-item">
                  <div className="nutrition-value">{recipe.nutritionalInfo.protein}g</div>
                  <div className="nutrition-label">Protein</div>
                </div>
                <div className="nutrition-item">
                  <div className="nutrition-value">{recipe.nutritionalInfo.carbs}g</div>
                  <div className="nutrition-label">Carbs</div>
                </div>
                <div className="nutrition-item">
                  <div className="nutrition-value">{recipe.nutritionalInfo.fat}g</div>
                  <div className="nutrition-label">Fat</div>
                </div>
              </div>
            </div>

            {/* Substitution Suggestions */}
            {substitutionSuggestions.length > 0 && (
              <div className="recipe-section">
                <h3 className="section-title">Ingredient Substitutions</h3>
                <div className="substitution-suggestions">
                  <div className="substitution-title">💡 Try these alternatives:</div>
                  {substitutionSuggestions.map((sub, index) => (
                    <div key={index} className="substitution-item">
                      <span className="substitution-ingredient">{sub.ingredient}:</span>
                      <span className="substitution-alternatives">
                        {sub.alternatives.join(', ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="recipe-section">
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '1rem',
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #e1e8ed'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button
                    className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
                    onClick={() => onToggleFavorite(recipe.id)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      background: 'none',
                      border: '1px solid #e1e8ed',
                      borderRadius: '6px',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Heart 
                      size={18} 
                      fill={isFavorite ? 'currentColor' : 'none'}
                    />
                    {isFavorite ? 'Favorited' : 'Add to Favorites'}
                  </button>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>Rate this recipe:</span>
                  {renderStars(rating)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
