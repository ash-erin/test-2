import { useState, useEffect, useCallback } from 'react';
import { 
  ProjectState, 
  saveProjectState, 
  loadProjectState, 
  clearProjectState,
  exportStateToFile,
  importStateFromFile,
  getStateStatistics
} from '../utils/statePersistence';
import { Movie } from '../types';
import { RecipeWithCuisine } from '../types/database';

export const useProjectState = () => {
  const [state, setState] = useState<ProjectState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Load state on mount
  useEffect(() => {
    loadState();
  }, []);

  // Auto-save state periodically
  useEffect(() => {
    if (!state) return;

    const autoSaveInterval = setInterval(() => {
      saveState(state);
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [state]);

  // Save state before page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (state) {
        // Use synchronous localStorage for immediate save
        try {
          const stateToSave = {
            ...state,
            timestamp: new Date().toISOString(),
            sessionData: {
              ...state.sessionData,
              lastActivity: new Date().toISOString()
            }
          };
          localStorage.setItem('project_state_v1', JSON.stringify(stateToSave));
        } catch (error) {
          console.error('Failed to save state on unload:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state]);

  const loadState = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await loadProjectState();
      
      if (result.success) {
        setState(result.state);
        console.log('State loaded successfully');
      } else {
        setError(result.error || 'Failed to load state');
        setState(result.state); // Use default state even if there was an error
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error loading state:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveState = useCallback(async (newState: ProjectState) => {
    try {
      setSaving(true);
      const result = await saveProjectState(newState);
      
      if (!result.success) {
        setError(result.error || 'Failed to save state');
        console.error('Save failed:', result.error);
      } else {
        setError(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error saving state:', err);
    } finally {
      setSaving(false);
    }
  }, []);

  const updateState = useCallback((updater: (prevState: ProjectState) => ProjectState) => {
    setState(prevState => {
      if (!prevState) return null;
      const newState = updater(prevState);
      saveState(newState); // Auto-save on update
      return newState;
    });
  }, [saveState]);

  // Specific update functions
  const updateMyList = useCallback((movieId: string, action: 'add' | 'remove') => {
    updateState(prevState => ({
      ...prevState,
      userPreferences: {
        ...prevState.userPreferences,
        myList: action === 'add' 
          ? [...prevState.userPreferences.myList, movieId]
          : prevState.userPreferences.myList.filter(id => id !== movieId)
      }
    }));
  }, [updateState]);

  const updateMovieLikes = useCallback((movieId: string, likes: number) => {
    updateState(prevState => ({
      ...prevState,
      userPreferences: {
        ...prevState.userPreferences,
        movieLikes: {
          ...prevState.userPreferences.movieLikes,
          [movieId]: likes
        }
      }
    }));
  }, [updateState]);

  const updateUserLikes = useCallback((movieId: string, liked: boolean) => {
    updateState(prevState => ({
      ...prevState,
      userPreferences: {
        ...prevState.userPreferences,
        userLikes: liked
          ? [...prevState.userPreferences.userLikes, movieId]
          : prevState.userPreferences.userLikes.filter(id => id !== movieId)
      }
    }));
  }, [updateState]);

  const updateLastSelectedMovie = useCallback((movie: Movie | null) => {
    updateState(prevState => ({
      ...prevState,
      uiState: {
        ...prevState.uiState,
        lastSelectedMovie: movie
      }
    }));
  }, [updateState]);

  const updateLastSelectedRecipe = useCallback((recipe: RecipeWithCuisine | null) => {
    updateState(prevState => ({
      ...prevState,
      uiState: {
        ...prevState.uiState,
        lastSelectedRecipe: recipe
      }
    }));
  }, [updateState]);

  const updateSearchQuery = useCallback((query: string) => {
    updateState(prevState => ({
      ...prevState,
      uiState: {
        ...prevState.uiState,
        lastSearchQuery: query
      },
      userPreferences: {
        ...prevState.userPreferences,
        searchHistory: query.trim() 
          ? [query, ...prevState.userPreferences.searchHistory.filter(q => q !== query)].slice(0, 50)
          : prevState.userPreferences.searchHistory
      }
    }));
  }, [updateState]);

  const updateAppSettings = useCallback((settings: Partial<ProjectState['appSettings']>) => {
    updateState(prevState => ({
      ...prevState,
      appSettings: {
        ...prevState.appSettings,
        ...settings
      }
    }));
  }, [updateState]);

  const addToViewingHistory = useCallback((movieId: string) => {
    updateState(prevState => ({
      ...prevState,
      userPreferences: {
        ...prevState.userPreferences,
        viewingHistory: [movieId, ...prevState.userPreferences.viewingHistory.filter(id => id !== movieId)].slice(0, 100)
      }
    }));
  }, [updateState]);

  const resetState = useCallback(async () => {
    try {
      setLoading(true);
      const result = await clearProjectState();
      
      if (result.success) {
        await loadState(); // Reload default state
      } else {
        setError(result.error || 'Failed to reset state');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadState]);

  const exportState = useCallback(() => {
    if (state) {
      exportStateToFile(state);
    }
  }, [state]);

  const importState = useCallback(async (file: File) => {
    try {
      setLoading(true);
      const result = await importStateFromFile(file);
      
      if (result.success) {
        setState(result.state);
        await saveState(result.state);
      } else {
        setError(result.error || 'Failed to import state');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [saveState]);

  const getStatistics = useCallback(() => {
    return state ? getStateStatistics(state) : null;
  }, [state]);

  return {
    // State
    state,
    loading,
    error,
    saving,
    
    // Actions
    loadState,
    saveState,
    updateState,
    resetState,
    exportState,
    importState,
    
    // Specific updaters
    updateMyList,
    updateMovieLikes,
    updateUserLikes,
    updateLastSelectedMovie,
    updateLastSelectedRecipe,
    updateSearchQuery,
    updateAppSettings,
    addToViewingHistory,
    
    // Utilities
    getStatistics
  };
};