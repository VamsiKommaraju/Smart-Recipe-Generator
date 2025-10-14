import React from 'react';
import { ChefHat, Clock, Users } from 'lucide-react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <ChefHat className="logo-icon" />
          Smart Recipe Generator
        </div>
        <div className="header-stats">
          <div className="stat">
            <Clock size={16} />
            <span>20+ Recipes</span>
          </div>
          <div className="stat">
            <Users size={16} />
            <span>Smart Matching</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
