import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import { LOCATIONS } from './constants/locations';
import SearchBar from './components/SearchBar';
import LandingDiscovery from './components/LandingDiscovery';
import HeroRecommendation from './components/HeroRecommendation';
import RecommendationsList from './components/RecommendationsList';
import UserProfileModal from './components/UserProfileModal';
import RestaurantPartnerModal from './components/RestaurantPartnerModal';
import SavedItemsDrawer from './components/SavedItemsDrawer';
import { 
  fetchRecommendations, 
  fetchUserPersonas, 
  fetchUserProfile, 
  sendUserEvent 
} from './services/api';
import { Sparkles, AlertCircle, ArrowLeft, Search, UtensilsCrossed, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeLocation, setActiveLocation] = useState(LOCATIONS[0]);
  const [personas, setPersonas] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const [currentQuery, setCurrentQuery] = useState('');
  const [recommendationResult, setRecommendationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Modals state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPartnerOpen, setIsPartnerOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);

  // Interaction state
  const [likedItemIds, setLikedItemIds] = useState([]);
  const [dislikedItemIds, setDislikedItemIds] = useState([]);
  const [savedItems, setSavedItems] = useState([]);

  // Toast notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Initial Load: Personas & Profile (No automatic search, show clean landing discovery)
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const personaList = await fetchUserPersonas();
      setPersonas(personaList);
      const defaultUser = personaList[0];
      setSelectedUser(defaultUser);

      if (defaultUser) {
        const prof = await fetchUserProfile(defaultUser.id);
        setUserProfile(prof);
        setLikedItemIds(prof.history?.liked_items || []);
        setDislikedItemIds(prof.history?.disliked_items || []);
        setSavedItems(prof.populated_history?.saved_items || []);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  // When User switches persona
  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    try {
      const prof = await fetchUserProfile(user.id);
      setUserProfile(prof);
      setLikedItemIds(prof.history?.liked_items || []);
      setDislikedItemIds(prof.history?.disliked_items || []);
      setSavedItems(prof.populated_history?.saved_items || []);
      showToast(`Switched persona to ${user.name} (${user.persona})`);
      if (currentQuery) {
        executeSearch(currentQuery, activeLocation, user.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // When Location changes
  const handleLocationChange = (newLoc) => {
    setActiveLocation(newLoc);
    showToast(`Location updated to ${newLoc.name}`);
    if (currentQuery) {
      executeSearch(currentQuery, newLoc, selectedUser?.id);
    }
  };

  // Search recommendation execution
  const executeSearch = async (queryText, loc = activeLocation, userId = selectedUser?.id) => {
    if (!queryText || !queryText.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);
    setCurrentQuery(queryText);

    try {
      const data = await fetchRecommendations(
        queryText,
        { lat: loc.lat, lng: loc.lng },
        userId || 'user_aarav'
      );
      setRecommendationResult(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Recommendation search error:', err);
      setErrorMsg(err.message || 'Failed to generate recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  // Interactive feedback handlers
  const handleLike = async (foodItem, restaurant) => {
    const isAlreadyLiked = likedItemIds.includes(foodItem.id);
    const newLiked = isAlreadyLiked
      ? likedItemIds.filter(id => id !== foodItem.id)
      : [...likedItemIds, foodItem.id];

    setLikedItemIds(newLiked);
    setDislikedItemIds(dislikedItemIds.filter(id => id !== foodItem.id));

    showToast(isAlreadyLiked ? 'Removed like' : `Liked ${foodItem.name}! Personalized preferences updated.`);

    try {
      await sendUserEvent(selectedUser.id, {
        event_type: 'food_liked',
        food_item_id: foodItem.id,
        restaurant_id: restaurant.id,
        query_context: currentQuery
      });
      const updatedProf = await fetchUserProfile(selectedUser.id);
      setUserProfile(updatedProf);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDislike = async (foodItem, restaurant) => {
    setDislikedItemIds([...dislikedItemIds, foodItem.id]);
    setLikedItemIds(likedItemIds.filter(id => id !== foodItem.id));
    showToast(`Disliked ${foodItem.name}. We will avoid similar recommendations.`);

    try {
      await sendUserEvent(selectedUser.id, {
        event_type: 'food_disliked',
        food_item_id: foodItem.id,
        restaurant_id: restaurant.id,
        query_context: currentQuery
      });
      const updatedProf = await fetchUserProfile(selectedUser.id);
      setUserProfile(updatedProf);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (foodItem, restaurant) => {
    const isAlreadySaved = savedItems.some(item => item.id === foodItem.id);
    let newSaved;
    if (isAlreadySaved) {
      newSaved = savedItems.filter(item => item.id !== foodItem.id);
      showToast(`Removed from saved dishes`);
    } else {
      newSaved = [...savedItems, { ...foodItem, restaurant_name: restaurant.name }];
      showToast(`Saved ${foodItem.name} to bookmarks!`);
    }
    setSavedItems(newSaved);

    try {
      await sendUserEvent(selectedUser.id, {
        event_type: isAlreadySaved ? 'food_unsaved' : 'food_saved',
        food_item_id: foodItem.id,
        restaurant_id: restaurant.id
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleOrder = async (foodItem, restaurant, platform) => {
    showToast(`Order confirmed via ${platform.display_name}`);
    try {
      await sendUserEvent(selectedUser.id, {
        event_type: 'order_clicked',
        food_item_id: foodItem.id,
        restaurant_id: restaurant.id,
        platform: platform.display_name
      });
      const updatedProf = await fetchUserProfile(selectedUser.id);
      setUserProfile(updatedProf);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectAlternativeHero = (rec) => {
    if (!recommendationResult) return;
    const currentHero = recommendationResult.hero_recommendation;
    const remaining = recommendationResult.other_recommendations.filter(r => r.food_item.id !== rec.food_item.id);
    
    setRecommendationResult({
      ...recommendationResult,
      hero_recommendation: rec,
      other_recommendations: [currentHero, ...remaining]
    });
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleResetToLanding = () => {
    setRecommendationResult(null);
    setCurrentQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-brand-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        activeLocation={activeLocation}
        setActiveLocation={handleLocationChange}
        personas={personas}
        selectedUser={selectedUser}
        setSelectedUser={handleSelectUser}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenPartner={() => setIsPartnerOpen(true)}
        onOpenSaved={() => setIsSavedOpen(true)}
        savedCount={savedItems.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        
        {/* Search Bar */}
        <SearchBar
          onSearch={(query) => executeSearch(query)}
          isLoading={isLoading}
        />

        {/* Error Alert */}
        {errorMsg && (
          <div className="max-w-4xl mx-auto px-4 my-4">
            <div className="p-4 rounded-2xl bg-red-50 text-red-800 border border-red-200 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          </div>
        )}

        {/* Loading State Skeleton */}
        {isLoading && (
          <div className="w-full max-w-4xl mx-auto px-4 my-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm animate-pulse space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-200" />
                <div className="h-4 bg-slate-200 rounded w-1/3" />
              </div>
              <div className="h-48 bg-slate-100 rounded-2xl" />
              <div className="grid grid-cols-3 gap-4">
                <div className="h-20 bg-slate-100 rounded-xl" />
                <div className="h-20 bg-slate-100 rounded-xl" />
                <div className="h-20 bg-slate-100 rounded-xl" />
              </div>
            </div>
          </div>
        )}

        {/* INITIAL LANDING STATE (When user hasn't searched yet) */}
        {!isLoading && !recommendationResult && (
          <LandingDiscovery
            onSelectCategory={(query) => executeSearch(query)}
            onSelectDish={(query) => executeSearch(query)}
            activeLocation={activeLocation}
          />
        )}

        {/* RECOMMENDATION RESULTS STATE (When user searches or clicks a category/dish) */}
        {!isLoading && recommendationResult && (
          <div className="space-y-4">
            
            {/* Back to Home / Reset Button */}
            <div className="max-w-4xl mx-auto px-4 pt-2 flex items-center justify-between">
              <button
                onClick={handleResetToLanding}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 shadow-2xs transition active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
                <span>Back to all cravings & top picks</span>
              </button>
              {currentQuery && (
                <span className="text-xs text-slate-400 font-medium hidden sm:inline truncate max-w-xs">
                  Showing results for "{currentQuery}"
                </span>
              )}
            </div>

            {/* Top Hero Pick Card */}
            {recommendationResult.hero_recommendation && (
              <>
                <HeroRecommendation
                  recommendation={recommendationResult.hero_recommendation}
                  onLike={handleLike}
                  onDislike={handleDislike}
                  onSave={handleSave}
                  onOrder={handleOrder}
                  isLiked={likedItemIds.includes(recommendationResult.hero_recommendation.food_item.id)}
                  isDisliked={dislikedItemIds.includes(recommendationResult.hero_recommendation.food_item.id)}
                  isSaved={savedItems.some(i => i.id === recommendationResult.hero_recommendation.food_item.id)}
                />

                {/* Other Ranked Alternatives */}
                <RecommendationsList
                  recommendations={recommendationResult.other_recommendations}
                  onSelectHero={handleSelectAlternativeHero}
                  onLike={handleLike}
                  onSave={handleSave}
                  likedItemIds={likedItemIds}
                  savedItemIds={savedItems.map(i => i.id)}
                />
              </>
            )}

            {/* Empty State / No Match */}
            {!recommendationResult.hero_recommendation && (
              <div className="max-w-xl mx-auto text-center py-16 px-4">
                <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-brand-200 shadow-sm">
                  <Search className="w-7 h-7 text-brand-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No matching dishes found</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Try searching for <span className="font-semibold text-slate-700">"fresh juice"</span>, <span className="font-semibold text-slate-700">"biryani"</span>, <span className="font-semibold text-slate-700">"paneer tikka"</span>, or <span className="font-semibold text-slate-700">"lava cake"</span>.
                </p>
                <button
                  onClick={handleResetToLanding}
                  className="mt-4 px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20 hover:bg-brand-700 transition"
                >
                  Browse all cravings
                </button>
              </div>
            )}

          </div>
        )}

      </main>

      {/* Modals & Drawers */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userProfile={userProfile}
      />

      <RestaurantPartnerModal
        isOpen={isPartnerOpen}
        onClose={() => setIsPartnerOpen(false)}
        onMenuUpdated={() => {
          if (currentQuery) executeSearch(currentQuery);
        }}
      />

      <SavedItemsDrawer
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        savedItems={savedItems}
        onUnsave={(item) => handleSave(item, { name: '' })}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
            <UtensilsCrossed className="w-4 h-4 text-brand-600" />
            <span>BiteWise</span>
            <span>•</span>
            <span>Smart Food Discovery & Multi-Platform Price Comparison</span>
          </div>
          <div className="text-slate-400">
            Find the best dishes at the lowest available prices across top platforms
          </div>
        </div>
      </footer>

    </div>
  );
}
