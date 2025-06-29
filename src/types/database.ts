export interface Recipe {
  id: string;
  title: string;
  description?: string;
  cuisine_id?: string;
  meal_type?: string;
  total_time_minutes?: number;
  servings?: number;
  notes?: string;
  created_at?: string;
  likes_count: number;
}

export interface Cuisine {
  id: string;
  name: string;
}

export interface RecipeWithCuisine extends Recipe {
  cuisine?: Cuisine;
}

export interface CuisineCarousel {
  id: string;
  name: string;
  recipes: RecipeWithCuisine[];
}