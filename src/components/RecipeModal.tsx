import React from 'react';
import { X, Clock, Users, Heart, ChefHat } from 'lucide-react';
import { RecipeWithCuisine } from '../types/database';

interface RecipeModalProps {
  recipe: RecipeWithCuisine;
  onClose: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose }) => {
  const getRecipeImageUrl = (recipeTitle: string) => {
    // Use a food-related placeholder image from Pexels
    const foodImages = [
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=800'
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
    <div 
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(8, 25, 50, 0.8)' }}
      onClick={onClose}
    >
      <div 
        className="rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto mt-20"
        style={{ backgroundColor: '#0f2f5f' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <div className="relative h-64 md:h-96 rounded-t-lg overflow-hidden" style={{ backgroundColor: '#081932' }}>
            <img
              src={getRecipeImageUrl(recipe.title)}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0f2f5f, transparent, transparent)' }} />
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2 rounded-full"
            style={{ backgroundColor: 'rgba(8, 25, 50, 0.5)' }}
          >
            <X size={24} />
          </button>

          <div className="absolute left-4 right-4 bottom-4">
            <h1 className="text-white text-3xl md:text-4xl font-bold mb-4">
              {recipe.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-4">
              {recipe.cuisine && (
                <div className="flex items-center space-x-2">
                  <ChefHat size={16} style={{ color: '#ddb870' }} />
                  <span className="text-white/90 text-sm">{recipe.cuisine.name}</span>
                </div>
              )}
              {recipe.total_time_minutes && (
                <div className="flex items-center space-x-2">
                  <Clock size={16} style={{ color: '#ddb870' }} />
                  <span className="text-white/90 text-sm">{formatDuration(recipe.total_time_minutes)}</span>
                </div>
              )}
              {recipe.servings && (
                <div className="flex items-center space-x-2">
                  <Users size={16} style={{ color: '#ddb870' }} />
                  <span className="text-white/90 text-sm">{recipe.servings} servings</span>
                </div>
              )}
              {recipe.likes_count > 0 && (
                <div className="flex items-center space-x-2">
                  <Heart size={16} style={{ color: '#ddb870' }} />
                  <span className="text-white/90 text-sm">{recipe.likes_count} likes</span>
                </div>
              )}
            </div>

            {recipe.meal_type && (
              <div className="mb-4">
                <span className="text-sm px-3 py-1 rounded-full text-white" style={{ backgroundColor: 'rgba(221, 184, 112, 0.8)' }}>
                  {recipe.meal_type}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="max-w-4xl">
            {recipe.description && (
              <div className="mb-6">
                <h2 className="text-white text-xl font-semibold mb-3">Description</h2>
                <p className="text-white/90 text-lg leading-relaxed">
                  {recipe.description}
                </p>
              </div>
            )}

            {recipe.notes && (
              <div className="mb-6">
                <h2 className="text-white text-xl font-semibold mb-3">Notes</h2>
                <p className="text-white/80 leading-relaxed">
                  {recipe.notes}
                </p>
              </div>
            )}

            <div className="text-center pt-4">
              <p className="text-white/60 text-sm">
                Recipe ID: {recipe.id}
              </p>
              {recipe.created_at && (
                <p className="text-white/60 text-sm">
                  Added: {new Date(recipe.created_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};