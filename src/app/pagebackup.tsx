'use client'

import { useState, useEffect, useMemo } from 'react';

// NOTE: In a real Next.js app, you would install and import these
// For this single-file component, we mock them.
const useSession = () => ({ data: null, status: 'unauthenticated' });
const signIn = async () => console.log("Signing In...");
const signOut = async () => console.log("Signing Out...");

// Helper Icons (Inline SVG for simplicity)
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
const LeafIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 4.293a1 1 0 011.414 1.414l-9.5 9.5a1 1 0 01-1.414 0l-4.5-4.5a1 1 0 011.414-1.414L8 12.586l8.293-8.293z" /></svg>;

// Main App Component
export default function CookingFormulationApp() {
  // In a real Next.js app, useSession() would provide the user's session
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionUser, setSessionUser] = useState(null); // To hold user data like { userType: '...' }

  const [page, setPage] = useState('builder');
  const [authMode, setAuthMode] = useState('login');

  // State for data fetched from API
  const [ingredients, setIngredients] = useState([]);
  const [retailers, setRetailers] = useState([]);
  const [recipe, setRecipe] = useState([]);
  // --- API Fetching ---
  useEffect(() => {
    // Only fetch data if the user is authenticated
    if (isAuthenticated) {
      fetch('/api/ingredients')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setIngredients(data);
        })
        .catch(err => console.error("Failed to fetch ingredients:", err));

      fetch('/api/retailers')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setRetailers(data);
        })
        .catch(err => console.error("Failed to fetch retailers:", err));
    }
  }, [isAuthenticated]); // Re-run when authentication status changes

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setSessionUser(null);
    setIngredients([]);
    setRetailers([]);
    setRecipe([]);
  };

  const Nav = () => (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 text-2xl font-bold text-gray-800">
            🍳 Formulation Designer
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setPage('builder')} className={`px-3 py-2 rounded-md text-sm font-medium ${page === 'builder' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>Builder</button>
            <button onClick={() => setPage('sourcing')} className={`px-3 py-2 rounded-md text-sm font-medium ${page === 'sourcing' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>Sourcing</button>
            {isAuthenticated && <button onClick={() => setPage('settings')} className={`px-3 py-2 rounded-md text-sm font-medium ${page === 'settings' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>Settings</button>}
            {isAuthenticated ?
              <button onClick={signOut} className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium">Sign Out</button> :
              <button onClick={() => setPage('auth')} className="bg-green-500 text-white px-3 py-2 rounded-md text-sm font-medium">Login</button>
            }
          </div>
        </div>
      </div>
    </nav>
  );

  const AuthPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('INDIVIDUAL');
    const [error, setError] = useState('');

    const handleLoginSuccess = (userData) => {
      setSessionUser(userData);
      setIsAuthenticated(true);
      setPage('builder');
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (authMode === 'login') {
        // await signIn('credentials', { redirect: false, email, password });
        alert("Login logic would run here!");
      } else {
        // await fetch('/api/auth/register', { method: 'POST', ... });
        alert("Registration logic would run here!");
      }
    };

    return (
      <div className="max-w-md mx-auto mt-10 p-8 border rounded-lg shadow-lg bg-white">
        <h2 className="text-3xl font-bold text-center mb-6">{authMode === 'login' ? 'Login' : 'Create Account'}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          {authMode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">I am a...</label>
              <select value={userType} onChange={e => setUserType(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                <option value="INDIVIDUAL">Home Cook / Individual</option>
                <option value="CATERER">Caterer / Business</option>
              </select>
            </div>
          )}
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            {authMode === 'login' ? 'Sign In' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="font-medium text-indigo-600 hover:text-indigo-500">
            {authMode === 'login' ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    );
  };

  const RecipeBuilder = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const addToRecipe = (ingredient) => {
      if (!recipe.find(item => item.ingredient.id === ingredient.id)) {
        setRecipe([...recipe, { ingredient, quantityG: 100 }]);
      }
    };

    const updateQuantity = (ingredientId, quantity) => {
      const newQuantity = parseInt(quantity, 10);
      if (isNaN(newQuantity) || newQuantity < 0) return;
      setRecipe(recipe.map(item => item.ingredient.id === ingredientId ? { ...item, quantityG: newQuantity } : item));
    };

    const removeFromRecipe = (ingredientId) => {
      setRecipe(recipe.filter(item => item.ingredient.id !== ingredientId));
    };

    const filteredIngredients = ingredients.filter(ing =>
      ing.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totals = useMemo(() => {
      let cost = 0;
      let calories = 0;
      let isAllVegan = true;
      let isAllVegetarian = true;

      recipe.forEach(({ ingredient, quantityG }) => {
        const cheapestSource = ingredient.sources.sort((a, b) => a.pricePerKg - b.pricePerKg)[0];
        if (cheapestSource) {
          cost += (cheapestSource.pricePerKg / 1000) * quantityG;
        }
        calories += (ingredient.caloriesPer100g / 100) * quantityG;
        if (!ingredient.isVegan) isAllVegan = false;
        if (!ingredient.isVegetarian) isAllVegetarian = false;
      });
      return { cost, calories, isAllVegan, isAllVegetarian };
    }, [recipe]);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
        {/* Ingredient List */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Ingredients</h3>
          <input type="text" placeholder="Search ingredients..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full px-3 py-2 border rounded-md mb-4" />
          <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
            {filteredIngredients.map(ing => (
              <li key={ing.id} className="flex justify-between items-center p-2 border-b">
                <span>{ing.name}</span>
                <button onClick={() => addToRecipe(ing)} className="p-1 rounded-full bg-indigo-500 text-white hover:bg-indigo-600"><PlusIcon /></button>
              </li>
            ))}
          </ul>
        </div>

        {/* Recipe & Totals */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Current Formulation</h3>
          <div className="space-y-3 mb-6">
            {recipe.length === 0 && <p className="text-gray-500">Add ingredients from the left to get started.</p>}
            {recipe.map(({ ingredient, quantityG }) => (
              <div key={ingredient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <span className="font-medium">{ingredient.name}</span>
                <div className="flex items-center space-x-2">
                  <input type="number" value={quantityG} onChange={e => updateQuantity(ingredient.id, e.target.value)} className="w-20 text-center border rounded-md p-1" />
                  <span>g</span>
                  <button onClick={() => removeFromRecipe(ingredient.id)} className="p-1 text-red-500 hover:text-red-700"><TrashIcon /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <h4 className="text-lg font-semibold mb-2">Totals</h4>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between items-center"><span>Estimated Cost:</span> <span className="font-bold text-xl text-green-600">${totals.cost.toFixed(2)}</span></div>
              <div className="flex justify-between items-center"><span>Total Calories:</span> <span className="font-bold">{Math.round(totals.calories)} kcal</span></div>
              <div className="flex justify-between items-center"><span>Dietary:</span>
                <div className="flex items-center space-x-4">
                  {totals.isAllVegan && <span className="flex items-center"><LeafIcon /> Vegan</span>}
                  {totals.isAllVegetarian && <span className="flex items-center"><LeafIcon /> Vegetarian</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SourcingPage = () => {
    const lowVolume = retailers.filter(r => r.volumeType === 'LOW');
    const highVolume = retailers.filter(r => r.volumeType === 'HIGH');
    return (
      <div className="max-w-7xl mx-auto p-8">
        <h2 className="text-3xl font-bold mb-6">Retailer Sourcing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-semibold mb-4 border-b pb-2">Low Volume (Individual)</h3>
            <ul className="space-y-4">
              {lowVolume.map(r => (
                <li key={r.id} className="p-4 bg-white rounded-lg shadow">
                  <a href={r.website} target="_blank" rel="noopener noreferrer" className="font-bold text-indigo-600 hover:underline">{r.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4 border-b pb-2">High Volume (Caterer)</h3>
            <ul className="space-y-4">
              {highVolume.map(r => (
                <li key={r.id} className="p-4 bg-white rounded-lg shadow">
                  <a href={r.website} target="_blank" rel="noopener noreferrer" className="font-bold text-indigo-600 hover:underline">{r.name}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  const SettingsPage = () => {
    // Mock user data
    const [userType, setUserType] = useState('INDIVIDUAL');

    return (
      <div className="max-w-2xl mx-auto mt-10 p-8 border rounded-lg shadow-lg bg-white">
        <h2 className="text-3xl font-bold mb-6">Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Type</label>
            <p className="text-xs text-gray-500 mb-2">This helps us tailor suggestions for you.</p>
            <select value={userType} onChange={e => setUserType(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="INDIVIDUAL">Home Cook / Individual</option>
              <option value="CATERER">Caterer / Business</option>
            </select>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700">Save Changes</button>
        </div>
      </div>
    )
  }

  const renderPage = () => {
    if (!isAuthenticated && page !== 'auth') {
      // In a real app, NextAuth middleware would handle redirects. Here we force the auth page.
      return <AuthPage />;
    }
    switch (page) {
      case 'builder': return <RecipeBuilder />;
      case 'sourcing': return <SourcingPage />;
      case 'settings': return <SettingsPage />;
      case 'auth': return <AuthPage />;
      default: return <RecipeBuilder />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Nav />
      <main>
        {renderPage()}
      </main>
    </div>
  );
}
