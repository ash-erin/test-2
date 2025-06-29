import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Recipe, Cuisine, RecipeWithCuisine, CuisineCarousel } from '../types/database';

export const useRecipes = () => {
  const [cuisineCarousels, setCuisineCarousels] = useState<CuisineCarousel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    fetchRecipesByCuisine();
  }, []);

  const fetchRecipesByCuisine = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if Supabase is configured
      if (!supabase) {
        throw new Error('Supabase not configured. Please connect to Supabase first.');
      }

      // Test connection first
      const { data: testData, error: testError } = await supabase
        .from('recipes')
        .select('count')
        .limit(1);

      if (testError) {
        throw new Error(`Database connection failed: ${testError.message}`);
      }

      setConnected(true);

      // Fetch recipes with their cuisine information
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select(`
          id,
          title,
          description,
          cuisine_id,
          meal_type,
          total_time_minutes,
          servings,
          notes,
          created_at,
          likes_count,
          cuisines (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (recipesError) {
        throw new Error(`Failed to fetch recipes: ${recipesError.message}`);
      }

      // Group recipes by cuisine
      const cuisineMap = new Map<string, CuisineCarousel>();

      recipesData?.forEach((recipe: any) => {
        const cuisineName = recipe.cuisines?.name || 'Other';
        const cuisineId = recipe.cuisines?.id || 'other';

        if (!cuisineMap.has(cuisineId)) {
          cuisineMap.set(cuisineId, {
            id: cuisineId,
            name: cuisineName,
            recipes: []
          });
        }

        const recipeWithCuisine: RecipeWithCuisine = {
          id: recipe.id,
          title: recipe.title,
          description: recipe.description,
          cuisine_id: recipe.cuisine_id,
          meal_type: recipe.meal_type,
          total_time_minutes: recipe.total_time_minutes,
          servings: recipe.servings,
          notes: recipe.notes,
          created_at: recipe.created_at,
          likes_count: recipe.likes_count,
          cuisine: recipe.cuisines ? {
            id: recipe.cuisines.id,
            name: recipe.cuisines.name
          } : undefined
        };

        cuisineMap.get(cuisineId)?.recipes.push(recipeWithCuisine);
      });

      // Convert map to array and filter out empty carousels
      const carousels = Array.from(cuisineMap.values())
        .filter(carousel => carousel.recipes.length > 0)
        .sort((a, b) => a.name.localeCompare(b.name));

      setCuisineCarousels(carousels);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setConnected(false);
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    cuisineCarousels,
    loading,
    error,
    connected,
    refetch: fetchRecipesByCuisine
  };
};