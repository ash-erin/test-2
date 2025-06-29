import { Movie } from '../types';
import { RecipeWithCuisine } from '../types/database';

// Define the complete project state interface
export interface ProjectState {
  version: string;
  timestamp: string;
  userPreferences: {
    myList: string[];
    movieLikes: Record<string, number>;
    userLikes: string[];
    searchHistory: string[];
    viewingHistory: string[];
  };
  uiState: {
    lastSelectedMovie: Movie | null;
    lastSelectedRecipe: RecipeWithCuisine | null;
    lastSearchQuery: string;
    scrollPositions: Record<string, number>;
    activeModals: string[];
  };
  appSettings: {
    theme: 'dark' | 'light' | 'auto';
    autoplay: boolean;
    volume: number;
    quality: string;
    language: string;
    notifications: boolean;
  };
  sessionData: {
    loginTime: string;
    lastActivity: string;
    sessionId: string;
  };
}

// Default state structure
const DEFAULT_STATE: ProjectState = {
  version: '1.0.0',
  timestamp: new Date().toISOString(),
  userPreferences: {
    myList: [],
    movieLikes: {},
    userLikes: [],
    searchHistory: [],
    viewingHistory: []
  },
  uiState: {
    lastSelectedMovie: null,
    lastSelectedRecipe: null,
    lastSearchQuery: '',
    scrollPositions: {},
    activeModals: []
  },
  appSettings: {
    theme: 'dark',
    autoplay: true,
    volume: 0.8,
    quality: 'auto',
    language: 'en',
    notifications: true
  },
  sessionData: {
    loginTime: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    sessionId: generateSessionId()
  }
};

// Generate unique session ID
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Validation functions
function isValidProjectState(data: any): data is ProjectState {
  try {
    return (
      typeof data === 'object' &&
      data !== null &&
      typeof data.version === 'string' &&
      typeof data.timestamp === 'string' &&
      typeof data.userPreferences === 'object' &&
      typeof data.uiState === 'object' &&
      typeof data.appSettings === 'object' &&
      typeof data.sessionData === 'object' &&
      Array.isArray(data.userPreferences.myList) &&
      typeof data.userPreferences.movieLikes === 'object' &&
      Array.isArray(data.userPreferences.userLikes)
    );
  } catch (error) {
    console.error('State validation error:', error);
    return false;
  }
}

function sanitizeState(state: Partial<ProjectState>): ProjectState {
  const sanitized = { ...DEFAULT_STATE };

  try {
    // Merge user preferences safely
    if (state.userPreferences) {
      sanitized.userPreferences = {
        myList: Array.isArray(state.userPreferences.myList) 
          ? state.userPreferences.myList.filter(id => typeof id === 'string')
          : [],
        movieLikes: typeof state.userPreferences.movieLikes === 'object' 
          ? state.userPreferences.movieLikes 
          : {},
        userLikes: Array.isArray(state.userPreferences.userLikes)
          ? state.userPreferences.userLikes.filter(id => typeof id === 'string')
          : [],
        searchHistory: Array.isArray(state.userPreferences.searchHistory)
          ? state.userPreferences.searchHistory.slice(-50) // Keep last 50 searches
          : [],
        viewingHistory: Array.isArray(state.userPreferences.viewingHistory)
          ? state.userPreferences.viewingHistory.slice(-100) // Keep last 100 views
          : []
      };
    }

    // Merge UI state safely
    if (state.uiState) {
      sanitized.uiState = {
        lastSelectedMovie: state.uiState.lastSelectedMovie || null,
        lastSelectedRecipe: state.uiState.lastSelectedRecipe || null,
        lastSearchQuery: typeof state.uiState.lastSearchQuery === 'string' 
          ? state.uiState.lastSearchQuery 
          : '',
        scrollPositions: typeof state.uiState.scrollPositions === 'object'
          ? state.uiState.scrollPositions
          : {},
        activeModals: Array.isArray(state.uiState.activeModals)
          ? state.uiState.activeModals
          : []
      };
    }

    // Merge app settings safely
    if (state.appSettings) {
      sanitized.appSettings = {
        theme: ['dark', 'light', 'auto'].includes(state.appSettings.theme)
          ? state.appSettings.theme
          : 'dark',
        autoplay: typeof state.appSettings.autoplay === 'boolean'
          ? state.appSettings.autoplay
          : true,
        volume: typeof state.appSettings.volume === 'number' && 
                state.appSettings.volume >= 0 && 
                state.appSettings.volume <= 1
          ? state.appSettings.volume
          : 0.8,
        quality: typeof state.appSettings.quality === 'string'
          ? state.appSettings.quality
          : 'auto',
        language: typeof state.appSettings.language === 'string'
          ? state.appSettings.language
          : 'en',
        notifications: typeof state.appSettings.notifications === 'boolean'
          ? state.appSettings.notifications
          : true
      };
    }

    // Update metadata
    sanitized.version = state.version || DEFAULT_STATE.version;
    sanitized.timestamp = new Date().toISOString();
    sanitized.sessionData = {
      loginTime: state.sessionData?.loginTime || new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      sessionId: generateSessionId()
    };

    return sanitized;
  } catch (error) {
    console.error('Error sanitizing state:', error);
    return DEFAULT_STATE;
  }
}

// Storage keys
const STORAGE_KEYS = {
  PROJECT_STATE: 'project_state_v1',
  BACKUP_STATE: 'project_state_backup_v1',
  STATE_CHECKSUM: 'project_state_checksum_v1'
} as const;

// Generate checksum for data integrity
function generateChecksum(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36);
}

// Save state with error handling and backup
export async function saveProjectState(state: ProjectState): Promise<{ success: boolean; error?: string }> {
  try {
    // Update timestamp and activity
    const stateToSave = {
      ...state,
      timestamp: new Date().toISOString(),
      sessionData: {
        ...state.sessionData,
        lastActivity: new Date().toISOString()
      }
    };

    // Validate state before saving
    if (!isValidProjectState(stateToSave)) {
      throw new Error('Invalid state structure');
    }

    const serializedState = JSON.stringify(stateToSave);
    const checksum = generateChecksum(serializedState);

    // Create backup of current state before overwriting
    const currentState = localStorage.getItem(STORAGE_KEYS.PROJECT_STATE);
    if (currentState) {
      localStorage.setItem(STORAGE_KEYS.BACKUP_STATE, currentState);
    }

    // Save new state
    localStorage.setItem(STORAGE_KEYS.PROJECT_STATE, serializedState);
    localStorage.setItem(STORAGE_KEYS.STATE_CHECKSUM, checksum);

    console.log('Project state saved successfully at:', stateToSave.timestamp);
    return { success: true };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Failed to save project state:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

// Load state with validation and fallback
export async function loadProjectState(): Promise<{ state: ProjectState; success: boolean; error?: string }> {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEYS.PROJECT_STATE);
    const storedChecksum = localStorage.getItem(STORAGE_KEYS.STATE_CHECKSUM);

    if (!serializedState) {
      console.log('No saved state found, using default state');
      return { state: DEFAULT_STATE, success: true };
    }

    // Verify data integrity
    const calculatedChecksum = generateChecksum(serializedState);
    if (storedChecksum && storedChecksum !== calculatedChecksum) {
      console.warn('State checksum mismatch, attempting to restore from backup');
      return await loadBackupState();
    }

    const parsedState = JSON.parse(serializedState);

    // Validate and sanitize loaded state
    if (!isValidProjectState(parsedState)) {
      console.warn('Invalid state structure, sanitizing...');
      const sanitizedState = sanitizeState(parsedState);
      await saveProjectState(sanitizedState); // Save the sanitized version
      return { state: sanitizedState, success: true };
    }

    console.log('Project state loaded successfully from:', parsedState.timestamp);
    return { state: parsedState, success: true };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Failed to load project state:', errorMessage);
    
    // Try to load backup state
    const backupResult = await loadBackupState();
    if (backupResult.success) {
      return backupResult;
    }

    // If all else fails, return default state
    return { state: DEFAULT_STATE, success: false, error: errorMessage };
  }
}

// Load backup state
async function loadBackupState(): Promise<{ state: ProjectState; success: boolean; error?: string }> {
  try {
    const backupState = localStorage.getItem(STORAGE_KEYS.BACKUP_STATE);
    
    if (!backupState) {
      throw new Error('No backup state available');
    }

    const parsedBackup = JSON.parse(backupState);
    const sanitizedState = sanitizeState(parsedBackup);
    
    console.log('Restored from backup state');
    return { state: sanitizedState, success: true };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load backup';
    console.error('Failed to load backup state:', errorMessage);
    return { state: DEFAULT_STATE, success: false, error: errorMessage };
  }
}

// Clear all saved state (for reset functionality)
export async function clearProjectState(): Promise<{ success: boolean; error?: string }> {
  try {
    localStorage.removeItem(STORAGE_KEYS.PROJECT_STATE);
    localStorage.removeItem(STORAGE_KEYS.BACKUP_STATE);
    localStorage.removeItem(STORAGE_KEYS.STATE_CHECKSUM);
    
    console.log('Project state cleared successfully');
    return { success: true };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Failed to clear project state:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

// Export state to file (for manual backup)
export function exportStateToFile(state: ProjectState): void {
  try {
    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `project-state-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(link.href);
    console.log('State exported to file successfully');

  } catch (error) {
    console.error('Failed to export state:', error);
  }
}

// Import state from file
export function importStateFromFile(file: File): Promise<{ state: ProjectState; success: boolean; error?: string }> {
  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const importedState = JSON.parse(content);
          
          if (!isValidProjectState(importedState)) {
            const sanitizedState = sanitizeState(importedState);
            resolve({ state: sanitizedState, success: true });
          } else {
            resolve({ state: importedState, success: true });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Invalid file format';
          resolve({ state: DEFAULT_STATE, success: false, error: errorMessage });
        }
      };
      
      reader.onerror = () => {
        resolve({ state: DEFAULT_STATE, success: false, error: 'Failed to read file' });
      };
      
      reader.readAsText(file);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      resolve({ state: DEFAULT_STATE, success: false, error: errorMessage });
    }
  });
}

// Get state statistics
export function getStateStatistics(state: ProjectState): Record<string, any> {
  return {
    version: state.version,
    lastSaved: state.timestamp,
    sessionId: state.sessionData.sessionId,
    myListCount: state.userPreferences.myList.length,
    likedMoviesCount: state.userPreferences.userLikes.length,
    totalLikes: Object.values(state.userPreferences.movieLikes).reduce((sum, likes) => sum + likes, 0),
    searchHistoryCount: state.userPreferences.searchHistory.length,
    viewingHistoryCount: state.userPreferences.viewingHistory.length,
    settings: state.appSettings
  };
}