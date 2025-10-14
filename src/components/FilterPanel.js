import React from 'react';
import { Filter, Clock, Utensils } from 'lucide-react';

const FilterPanel = ({ 
  filters, 
  onFilterChange, 
  dietaryOptions, 
  difficultyLevels, 
  cuisineTypes 
}) => {
  const handleDietaryChange = (dietary) => {
    const newDietary = filters.dietary.includes(dietary)
      ? filters.dietary.filter(d => d !== dietary)
      : [...filters.dietary, dietary];
    onFilterChange('dietary', newDietary);
  };

  const handleDifficultyChange = (difficulty) => {
    const newDifficulty = filters.difficulty.includes(difficulty)
      ? filters.difficulty.filter(d => d !== difficulty)
      : [...filters.difficulty, difficulty];
    onFilterChange('difficulty', newDifficulty);
  };

  const handleCuisineChange = (cuisine) => {
    const newCuisine = filters.cuisine.includes(cuisine)
      ? filters.cuisine.filter(c => c !== cuisine)
      : [...filters.cuisine, cuisine];
    onFilterChange('cuisine', newCuisine);
  };

  const handleTimeChange = (e) => {
    onFilterChange('maxCookingTime', parseInt(e.target.value));
  };

  const handleCaloriesChange = (e) => {
    onFilterChange('maxCalories', parseInt(e.target.value));
  };

  const clearFilters = () => {
    onFilterChange('dietary', []);
    onFilterChange('difficulty', []);
    onFilterChange('cuisine', []);
    onFilterChange('maxCookingTime', 120);
    onFilterChange('maxCalories', 1000);
  };

  const hasActiveFilters = 
    filters.dietary.length > 0 || 
    filters.difficulty.length > 0 || 
    filters.cuisine.length > 0 || 
    filters.maxCookingTime < 120 || 
    filters.maxCalories < 1000;

  return (
    <div className="filter-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <Filter size={20} />
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            style={{
              background: 'none',
              border: '1px solid #e1e8ed',
              borderRadius: '6px',
              padding: '0.25rem 0.75rem',
              fontSize: '0.8rem',
              color: '#666',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#f1f3f4';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Dietary Preferences */}
      <div className="filter-section">
        <h4 className="filter-title">Dietary Preferences</h4>
        <div className="filter-options">
          {dietaryOptions.map((dietary) => (
            <label key={dietary} className="filter-option">
              <input
                type="checkbox"
                className="filter-checkbox"
                checked={filters.dietary.includes(dietary)}
                onChange={() => handleDietaryChange(dietary)}
              />
              <span className="filter-label">
                {dietary.charAt(0).toUpperCase() + dietary.slice(1).replace('-', ' ')}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Difficulty Level */}
      <div className="filter-section">
        <h4 className="filter-title">Difficulty</h4>
        <div className="filter-options">
          {difficultyLevels.map((difficulty) => (
            <label key={difficulty} className="filter-option">
              <input
                type="checkbox"
                className="filter-checkbox"
                checked={filters.difficulty.includes(difficulty)}
                onChange={() => handleDifficultyChange(difficulty)}
              />
              <span className="filter-label">{difficulty}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Cuisine Type */}
      <div className="filter-section">
        <h4 className="filter-title">Cuisine</h4>
        <div className="filter-options">
          {cuisineTypes.map((cuisine) => (
            <label key={cuisine} className="filter-option">
              <input
                type="checkbox"
                className="filter-checkbox"
                checked={filters.cuisine.includes(cuisine)}
                onChange={() => handleCuisineChange(cuisine)}
              />
              <span className="filter-label">{cuisine}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Cooking Time */}
      <div className="filter-section">
        <h4 className="filter-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={16} />
          Max Cooking Time
        </h4>
        <input
          type="range"
          min="15"
          max="120"
          step="15"
          value={filters.maxCookingTime}
          onChange={handleTimeChange}
          className="range-input"
        />
        <div className="range-value">{filters.maxCookingTime} minutes</div>
      </div>

      {/* Calories */}
      <div className="filter-section">
        <h4 className="filter-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Utensils size={16} />
          Max Calories
        </h4>
        <input
          type="range"
          min="100"
          max="1000"
          step="50"
          value={filters.maxCalories}
          onChange={handleCaloriesChange}
          className="range-input"
        />
        <div className="range-value">{filters.maxCalories} calories</div>
      </div>
    </div>
  );
};

export default FilterPanel;
