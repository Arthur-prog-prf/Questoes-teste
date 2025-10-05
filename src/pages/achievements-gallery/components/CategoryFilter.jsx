import React from 'react';
import Icon from '../../../components/AppIcon';

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories?.map((category) => (
        <button
          key={category?.id}
          onClick={() => onCategoryChange(category?.id)}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium
            transition-all duration-150 border
            ${activeCategory === category?.id
              ? 'bg-primary text-primary-foreground border-primary shadow-subtle'
              : 'bg-card text-text-secondary border-border hover:bg-muted hover:text-foreground'
            }
          `}
        >
          <Icon name={category?.icon} size={16} />
          <span>{category?.name}</span>
          <span className={`
            px-2 py-0.5 rounded-full text-xs
            ${activeCategory === category?.id
              ? 'bg-primary-foreground text-primary'
              : 'bg-muted text-text-secondary'
            }
          `}>
            {category?.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;