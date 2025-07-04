import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ContentRow } from './components/ContentRow';
import { VideoPlayer } from './components/VideoPlayer';
import { MovieModal } from './components/MovieModal';
import { SearchResults } from './components/SearchResults';
import { ProfileDropdown } from './components/ProfileDropdown';
import { NotificationDropdown } from './components/NotificationDropdown';
import { SettingsModal } from './components/SettingsModal';
import { HelpModal } from './components/HelpModal';
import { LogoutModal } from './components/LogoutModal';
import { RecipeCarousel } from './components/RecipeCarousel';
import { RecipeModal } from './components/RecipeModal';
import { DatabaseStatus } from './components/DatabaseStatus';
import { StateManager } from './components/StateManager';
import { featuredMovie, contentRows, movies, getMostLikedMovies } from './data/movies';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useRecipes } from './hooks/useRecipes';
import { useProjectState } from './hooks/useProjectState';
import { Movie } from './types';
import { RecipeWithCuisine } from './types/database';

function App() {
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeWithCuisine | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showStateManager, setShowStateManager] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<Movie[]>([]);

  // Legacy local storage hooks (for backward compatibility)
  const [myList, setMyList] = useLocalStorage<string[]>('project-mylist', []);
  const [movieLikes, setMovieLikes] = useLocalStorage<Record<string, number>>('project-likes', {});
  const [userLikes, setUserLikes] = useLocalStorage<string[]>('project-user-likes', []);

  // New state persistence system
  const {
    state: projectState,
    loading: stateLoading,
    updateMyList,
    updateMovieLikes,
    updateUserLikes,
    updateLastSelectedMovie,
    updateLastSelectedRecipe,
    updateSearchQuery,
    addToViewingHistory
  } = useProjectState();

  // Database integration
  const { cuisineCarousels, loading, error, connected, refetch } = useRecipes();

  // Initialize state from persistence system
  useEffect(() => {
    if (projectState && !stateLoading) {
      // Sync legacy state with new persistence system
      if (projectState.userPreferences.myList.length > 0) {
        setMyList(projectState.userPreferences.myList);
      }
      if (Object.keys(projectState.userPreferences.movieLikes).length > 0) {
        setMovieLikes(projectState.userPreferences.movieLikes);
      }
      if (projectState.userPreferences.userLikes.length > 0) {
        setUserLikes(projectState.userPreferences.userLikes);
      }
      
      // Restore UI state
      if (projectState.uiState.lastSearchQuery) {
        setSearchQuery(projectState.uiState.lastSearchQuery);
      }
      if (projectState.uiState.lastSelectedMovie) {
        setSelectedMovie(projectState.uiState.lastSelectedMovie);
      }
      if (projectState.uiState.lastSelectedRecipe) {
        setSelectedRecipe(projectState.uiState.lastSelectedRecipe);
      }
    }
  }, [projectState, stateLoading, setMyList, setMovieLikes, setUserLikes]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updateSearchQuery(query);
    
    if (query.trim()) {
      // Get all movies from regular movies array and content rows
      const allMovies = [...movies];
      
      // Add movies from content rows that aren't already in the regular movies array
      contentRows.forEach(row => {
        row.movies.forEach(movie => {
          if (!allMovies.find(m => m.id === movie.id)) {
            allMovies.push(movie);
          }
        });
      });
      
      const results = allMovies.filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.description.toLowerCase().includes(query.toLowerCase()) ||
        movie.genre.some(g => g.toLowerCase().includes(query.toLowerCase()))
      );
      setSearchResults(results);
      setSearchSuggestions(results.slice(0, 6)); // Limit suggestions to 6 items
    } else {
      setSearchResults([]);
      setSearchSuggestions([]);
    }
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    updateLastSelectedMovie(movie);
  };

  const handleRecipeSelect = (recipe: RecipeWithCuisine) => {
    setSelectedRecipe(recipe);
    updateLastSelectedRecipe(recipe);
  };

  const handlePlay = (movie: Movie) => {
    setCurrentMovie(movie);
    addToViewingHistory(movie.id);
  };

  const handleAddToList = (movie: Movie) => {
    const isInList = myList.includes(movie.id);
    const newList = isInList 
      ? myList.filter(id => id !== movie.id)
      : [...myList, movie.id];
    
    setMyList(newList);
    updateMyList(movie.id, isInList ? 'remove' : 'add');
  };

  const handleMoreInfo = (movie: Movie) => {
    setSelectedMovie(movie);
    updateLastSelectedMovie(movie);
  };

  const handleSignOut = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    // In a real app, this would clear auth tokens and redirect to login
    console.log('Signing out...');
  };

  const handleLogoClick = () => {
    // This function is no longer needed as we handle it in Header
    // but keeping it for backward compatibility
    window.location.reload();
  };

  const handleNotificationClick = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
    setShowProfileDropdown(false);
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
    setShowNotificationDropdown(false);
  };

  const handleLike = (movie: Movie) => {
    const isLiked = userLikes.includes(movie.id);
    const currentLikes = movieLikes[movie.id] || movie.likes || 0;
    
    if (isLiked) {
      // Remove like
      const newUserLikes = userLikes.filter(id => id !== movie.id);
      const newLikes = Math.max(0, currentLikes - 1);
      
      setUserLikes(newUserLikes);
      setMovieLikes(prev => ({ ...prev, [movie.id]: newLikes }));
      updateUserLikes(movie.id, false);
      updateMovieLikes(movie.id, newLikes);
    } else {
      // Add like
      const newUserLikes = [...userLikes, movie.id];
      const newLikes = currentLikes + 1;
      
      setUserLikes(newUserLikes);
      setMovieLikes(prev => ({ ...prev, [movie.id]: newLikes }));
      updateUserLikes(movie.id, true);
      updateMovieLikes(movie.id, newLikes);
    }
  };

  // Update movies with current like counts
  const moviesWithUpdatedLikes = movies.map(movie => ({
    ...movie,
    likes: movieLikes[movie.id] || movie.likes || 0
  }));

  // Update content rows with current like counts
  const updatedContentRows = contentRows.map(row => {
    if (row.id === 'most-liked') {
      // Get all movies from regular movies array and custom content rows
      const allMoviesForLiking = [...moviesWithUpdatedLikes];
      
      // Add custom movies from content rows to the liking system
      contentRows.forEach(contentRow => {
        if (contentRow.id !== 'most-liked') {
          contentRow.movies.forEach(movie => {
            // Only add if it's not already in the regular movies array
            if (!moviesWithUpdatedLikes.find(m => m.id === movie.id)) {
              const updatedMovie = {
                ...movie,
                likes: movieLikes[movie.id] || movie.likes || 0
              };
              allMoviesForLiking.push(updatedMovie);
            }
          });
        }
      });
      
      const mostLiked = allMoviesForLiking
        .sort((a, b) => (b.likes || 0) - (a.likes || 0))
        .slice(0, 12);
      return { ...row, movies: mostLiked };
    }
    return {
      ...row,
      movies: row.movies.map(movie => 
        moviesWithUpdatedLikes.find(m => m.id === movie.id) || movie
      )
    };
  });

  // Also include custom movies from content rows that are in myList
  const myListMovies = movies.filter(movie => myList.includes(movie.id));
  
  // Get custom movies from content rows that are in myList (avoiding duplicates)
  const customMoviesInMyList: Movie[] = [];
  const addedIds = new Set(myListMovies.map(m => m.id));
  
  contentRows.forEach(row => {
    row.movies.forEach(movie => {
      if (myList.includes(movie.id) && !addedIds.has(movie.id)) {
        // Apply current like count to custom movies
        const updatedMovie = {
          ...movie,
          likes: movieLikes[movie.id] || movie.likes || 0
        };
        customMoviesInMyList.push(updatedMovie);
        addedIds.add(movie.id);
      }
    });
  });
  
  const allMyListMovies = [...myListMovies, ...customMoviesInMyList];
  
  const finalContentRows = allMyListMovies.length > 0 
    ? [{ id: 'mylist', title: 'My List', movies: allMyListMovies }, ...updatedContentRows]
    : updatedContentRows;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#081932' }}>
      <Header
        onSearch={handleSearch}
        onProfileClick={handleProfileClick}
        onNotificationClick={handleNotificationClick}
        onLogoClick={handleLogoClick}
        isScrolled={isScrolled}
        searchSuggestions={searchSuggestions}
        onMovieSelect={handleMovieSelect}
      />

      <ProfileDropdown
        isOpen={showProfileDropdown}
        onClose={() => setShowProfileDropdown(false)}
        onSignOut={handleSignOut}
        onSettings={() => setShowSettingsModal(true)}
        onHelp={() => setShowHelpModal(true)}
        onStateManager={() => setShowStateManager(true)}
      />

      <NotificationDropdown
        isOpen={showNotificationDropdown}
        onClose={() => setShowNotificationDropdown(false)}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />

      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirmLogout={handleConfirmLogout}
      />

      <StateManager
        isOpen={showStateManager}
        onClose={() => setShowStateManager(false)}
      />

      {searchQuery ? (
        <SearchResults
          query={searchQuery}
          results={searchResults}
          onPlay={handlePlay}
          onAddToList={handleAddToList}
          onMoreInfo={handleMoreInfo}
          myList={myList}
        />
      ) : (
        <>
          <Hero
            movie={featuredMovie}
            onPlay={handlePlay}
            onAddToList={handleAddToList}
            onMoreInfo={handleMoreInfo}
            myList={myList}
          />

          <div className="relative -mt-16 z-10">
            {/* Database Status */}
            <DatabaseStatus
              connected={connected}
              loading={loading}
              error={error}
              onRetry={refetch}
            />

            {/* Recipe Carousels from Database */}
            {connected && cuisineCarousels.length > 0 && (
              <div className="mb-8">
                <h2 className="text-white text-2xl md:text-3xl font-bold mb-6 px-4 md:px-8">
                  Recipes by Cuisine
                </h2>
                {cuisineCarousels.map((carousel) => (
                  <RecipeCarousel
                    key={carousel.id}
                    title={carousel.name}
                    recipes={carousel.recipes}
                    onRecipeClick={handleRecipeSelect}
                  />
                ))}
              </div>
            )}

            {/* Original Content Rows */}
            {finalContentRows.map((row) => (
              <div
                key={row.id}
                data-content-row
                id={row.id === 'mylist' ? 'mylist-section' : undefined}
                data-section={row.id === 'most-liked' ? 'most-popular' : undefined}
                className={row.id === 'mylist' ? 'pt-8' : ''}
              >
                <ContentRow
                  title={row.title}
                  movies={row.movies}
                  onPlay={handlePlay}
                  onAddToList={handleAddToList}
                  onMoreInfo={handleMoreInfo}
                  isMyListRow={row.id === 'mylist'}
                  myList={myList}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {currentMovie && (
        <VideoPlayer
          movie={currentMovie}
          onClose={() => setCurrentMovie(null)}
        />
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onPlay={handlePlay}
          onAddToList={handleAddToList}
          onLike={handleLike}
          currentLikes={movieLikes[selectedMovie.id] || selectedMovie.likes || 0}
          isLiked={userLikes.includes(selectedMovie.id)}
          myList={myList}
        />
      )}

      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}

      {/* State Loading Indicator */}
      {stateLoading && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white" style={{ backgroundColor: 'rgba(8, 25, 50, 0.9)' }}>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-500 border-t-transparent"></div>
            <span className="text-sm">Loading state...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;