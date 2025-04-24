'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, logout, loading, updateUserProfile, updateUserPreferences, getUserPreferences } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setDisplayName(user.displayName || '');

      const loadPreferences = async () => {
        const prefs = await getUserPreferences();
        if (prefs) {
          setNotifications(prefs.notifications);
          setDarkMode(prefs.darkMode);
        }
      };

      loadPreferences();
    }
  }, [user, getUserPreferences]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const handleClickOutside = () => {
      if (dropdownOpen) setDropdownOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(false);
    setSaveError(null);

    try {
      await updateUserProfile({ displayName, email });
      await updateUserPreferences({ notifications, darkMode });

      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      if (error instanceof Error) setSaveError(error.message);
      else setSaveError('An error occurred while saving your profile');
    }
  };

  const handleToggleNotifications = async (value: boolean) => {
    setNotifications(value);
    try {
      await updateUserPreferences({ notifications: value, darkMode });
    } catch (error) {
      console.error('Error updating notifications preference:', error);
    }
  };

  const handleToggleDarkMode = async (value: boolean) => {
    setDarkMode(value);
    try {
      await updateUserPreferences({ notifications, darkMode: value });
    } catch (error) {
      console.error('Error updating dark mode preference:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="bg-[#1A237E] text-white py-6">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold">PC Part Finder</h1>
          </div>
        </header>
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#303F9F] border-t-[#1A237E] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl text-black">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header copied from dashboard */}
      <header className="bg-[#1A237E] text-white py-6 relative">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">PC Part Finder</h1>
            <div className="flex items-center space-x-4">
              <Link href="/cart">
                <button className="bg-[#3949AB] hover:bg-[#303F9F] text-white p-2 rounded-full transition-colors flex items-center justify-center">
                  <ShoppingCart size={20} />
                </button>
              </Link>
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center bg-[#303F9F] hover:bg-[#3949AB] text-white px-4 py-2 rounded-full transition-colors"
                >
                  <div className="w-8 h-8 bg-[#1A237E] rounded-full flex items-center justify-center mr-2">
                    <span className="text-white font-medium">
                      {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link href="/profile">
                      <div className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">
                        Profile
                      </div>
                    </Link>
                    <div className="border-t border-gray-100"></div>
                    <div 
                      onClick={handleLogout}
                      className="block px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer"
                    >
                      Sign Out
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navbar copied from dashboard */}
      <nav className="bg-[#303F9F] text-white py-4">
        <div className="container mx-auto flex justify-center">
          <div className="flex space-x-0">
            <Link href="/dashboard" className="hover:underline px-4">Home</Link>
            <Link href="/project" className="hover:underline px-4">Project</Link>
            <Link href="/contact" className="hover:underline px-4">Contact</Link>
            <Link href="/aboutus" className="hover:underline px-4">About Us</Link>
          </div>
        </div>
      </nav>

      {/* Main content with white background */}
      <main className="flex-grow bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-semibold text-black">Profile</h2>
              <Link 
                href="/dashboard"
                className="text-[#303F9F] hover:text-[#1A237E] font-medium"
              >
                ← Back to Dashboard
              </Link>
            </div>
            
            {/* Success message */}
            {saveSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                Your profile has been updated successfully!
              </div>
            )}
            
            {/* Error message */}
            {saveError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {saveError}
              </div>
            )}
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-black">Account Information</h3>
                <button 
                  onClick={() => setIsEditing(!isEditing)} 
                  className="text-[#303F9F] hover:text-[#1A237E] font-medium"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
              
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="displayName" className="block text-black font-medium mb-2">Display Name</label>
                    <input
                      type="text"
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#303F9F] text-black"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-black font-medium mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#303F9F] text-black"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notifications"
                      checked={notifications}
                      onChange={(e) => setNotifications(e.target.checked)}
                      className="h-4 w-4 text-[#303F9F] focus:ring-[#303F9F] border-gray-300 rounded"
                    />
                    <label htmlFor="notifications" className="ml-2 block text-black">
                      Receive email notifications
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="darkMode"
                      checked={darkMode}
                      onChange={(e) => setDarkMode(e.target.checked)}
                      className="h-4 w-4 text-[#303F9F] focus:ring-[#303F9F] border-gray-300 rounded"
                    />
                    <label htmlFor="darkMode" className="ml-2 block text-black">
                      Enable dark mode
                    </label>
                  </div>
                  <div className="pt-4">
                    <button 
                      type="submit"
                      className="bg-[#303F9F] hover:bg-[#1A237E] text-white px-6 py-2 rounded-lg transition-colors font-medium"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-black text-sm">Display Name</p>
                      <p className="font-medium text-black">{displayName || 'Not set'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-black text-sm">Email</p>
                      <p className="font-medium text-black">{email}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-black text-sm">User ID</p>
                    <p className="font-medium font-mono text-sm text-black">{user.uid}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-black text-sm">Account Created</p>
                    <p className="font-medium text-black">{user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown'}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold text-black mb-4">Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="font-medium text-black">Email Notifications</p>
                    <p className="text-black text-sm">Receive updates about your projects and account</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notifications} 
                      onChange={(e) => handleToggleNotifications(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#303F9F]"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="font-medium text-black">Dark Mode</p>
                    <p className="text-black text-sm">Switch between light and dark theme</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={darkMode} 
                      onChange={(e) => handleToggleDarkMode(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#303F9F]"></div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="border-t mt-8 pt-6">
              <h3 className="text-xl font-semibold text-black mb-4">Security</h3>
              <div className="space-y-4">
                <button className="bg-gray-50 hover:bg-gray-100 transition-colors w-full text-left px-4 py-3 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-medium text-black">Change Password</p>
                    <p className="text-black text-sm">Update your password</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button className="bg-gray-50 hover:bg-gray-100 transition-colors w-full text-left px-4 py-3 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-medium text-black">Two-Factor Authentication</p>
                    <p className="text-black text-sm">Add an extra layer of security</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer with dark blue background */}
      <footer className="bg-[#1A237E] text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} PC Part Picker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}