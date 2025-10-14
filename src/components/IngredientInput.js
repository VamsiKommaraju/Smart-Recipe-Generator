import React, { useState, useRef, useEffect } from 'react';
import { X, Search } from 'lucide-react';

const IngredientInput = ({ 
  selectedIngredients, 
  onIngredientAdd, 
  onIngredientRemove, 
  commonIngredients 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Filter ingredients based on search term
  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = commonIngredients.filter(ingredient =>
        ingredient.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedIngredients.includes(ingredient)
      );
      setFilteredIngredients(filtered.slice(0, 8)); // Limit to 8 suggestions
      setShowSuggestions(true);
    } else {
      setFilteredIngredients([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, selectedIngredients, commonIngredients]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleIngredientSelect = (ingredient) => {
    onIngredientAdd(ingredient);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      const ingredient = searchTerm.trim().toLowerCase();
      if (!selectedIngredients.includes(ingredient) && ingredient.length > 0) {
        onIngredientAdd(ingredient);
        setSearchTerm('');
        setShowSuggestions(false);
      }
    }
  };

  const handleRemoveIngredient = (ingredient) => {
    onIngredientRemove(ingredient);
  };

  return (
    <div className="ingredient-input">
      <h2 className="input-title">What ingredients do you have?</h2>
      
      <div className="ingredient-search">
        <div style={{ position: 'relative' }}>
          <Search size={20} style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: '#666' 
          }} />
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Type or select ingredients..."
            value={searchTerm}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={() => searchTerm.length > 0 && setShowSuggestions(true)}
            style={{ paddingLeft: '40px' }}
          />
        </div>
        
        {showSuggestions && filteredIngredients.length > 0 && (
          <div ref={suggestionsRef} className="suggestions">
            {filteredIngredients.map((ingredient, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleIngredientSelect(ingredient)}
              >
                {ingredient}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedIngredients.length > 0 && (
        <div className="selected-ingredients">
          {selectedIngredients.map((ingredient, index) => (
            <div key={index} className="ingredient-tag">
              <span>{ingredient}</span>
              <button
                className="remove-ingredient"
                onClick={() => handleRemoveIngredient(ingredient)}
                type="button"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IngredientInput;
