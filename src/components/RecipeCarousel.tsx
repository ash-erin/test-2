import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Users, Heart } from 'lucide-react';
import { RecipeWithCuisine } from '../types/database';

interface RecipeCarouselProps {
  title: string;
  recipes: RecipeWithCuisine[];
  onRecipeClick?: (recipe: RecipeWithCuisine) => void;
}

export const RecipeCarousel: React.FC<RecipeCarouselProps> = ({
  title,
  recipes,
  onRecipeClick
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [hoveredRecipe, setHoveredRecipe] = useState<string | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const scrollAmount = 400;
    const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    
    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const getRecipeImageUrl = (recipeTitle: string) => {
    // Use a food-related placeholder image from Pexels
    const foodImages = [
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=400'
    ];
    
    // Use recipe title hash to consistently select the same image for the same recipe
    const hash = recipeTitle.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return foodImages[Math.abs(hash) % foodImages.length];
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="px-4 md:px-8 mb-8">
      <h2 className="text-white text-xl md:text-2xl font-semibold mb-4">{title}</h2>
      
      <div className="relative group">
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 text-white p-2 rounded-r-md opacity-0 group-hover:opacity-100 transition-all duration-300"
            style={{ backgroundColor: 'rgba(8, 25, 50, 0.8)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#081932'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(8, 25, 50, 0.8)'}
          >
            <ChevronLeft size={24} />
          </button>
        )}
        
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 text-white p-2 rounded-l-md opacity-0 group-hover:opacity-100 transition-all duration-300"
            style={{ backgroundColor: 'rgba(8, 25, 50, 0.8)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#081932'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(8, 25, 50, 0.8)'}
          >
            <ChevronRight size={24} />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex space-x-4 overflow-x-auto overflow-y-visible scrollbar-hide scroll-smooth py-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {recipes.map((recipe, index) => {
            const isHovered = hoveredRecipe === recipe.id;
            const isFirstItem = index === 0;
            const isLastItem = index === recipes.length - 1;
            
            return (
              <div
                key={recipe.id}
                className={`relative flex-shrink-0 w-48 md:w-64 cursor-pointer transition-all duration-300 ${
                  isHovered 
                    ? `z-30 ${isFirstItem ? 'origin-left' : isLastItem ? 'origin-right' : 'origin-center'} scale-105` 
                    : 'z-10'
                }`}
                onMouseEnter={() => setHoveredRecipe(recipe.id)}
                onMouseLeave={() => setHoveredRecipe(null)}
                onClick={() => onRecipeClick?.(recipe)}
              >
                <div className="relative overflow-hidden rounded-md transition-all duration-300">
                  <img
                    src={getRecipeImageUrl(recipe.title)}
                    alt={recipe.title}
                    className="w-full h-36 md:h-48 object-cover"
                  />
                  
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`} style={{ background: 'linear-gradient(to top, rgba(8, 25, 50, 0.9), rgba(8, 25, 50, 0.2), transparent)' }} />
                  
                  <div className={`absolute bottom-0 left-0 right-0 p-3 md:p-4 transition-all duration-300 ${
                    isHovered 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-4 opacity-0'
                  }`}>
                    <h3 className="text-white font-semibold text-sm md:text-base mb-2 line-clamp-2 drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.9)' }}>
                      {recipe.title}
                    </h3>
                    
                    <div className="flex items-center space-x-3 mb-3 text-xs md:text-sm">
                      {recipe.total_time_minutes && (
                        <div className="flex items-center space-x-1">
                          <Clock size={12} className="text-white/80" />
                          <span className="text-white/80">{formatDuration(recipe.total_time_minutes)}</span>
                        </div>
                      )}
                      {recipe.servings && (
                        <div className="flex items-center space-x-1">
                          <Users size={12} className="text-white/80" />
                          <span className="text-white/80">{recipe.servings}</span>
                        </div>
                      )}
                      {recipe.likes_count > 0 && (
                        <div className="flex items-center space-x-1">
                          <Heart size={12} style={{ color: '#ddb870' }} />
                          <span className="text-white/80">{recipe.likes_count}</span>
                        </div>
                      )}
                    </div>
                    
                    {recipe.meal_type && (
                      <div className="mb-2">
                        <span className="text-xs px-2 py-1 rounded-full text-white" style={{ backgroundColor: 'rgba(221, 184, 112, 0.8)' }}>
                          {recipe.meal_type}
                        </span>
                      </div>
                    )}
                    
                    {recipe.description && (
                      <p className="text-white/70 text-xs line-clamp-2">
                        {recipe.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};