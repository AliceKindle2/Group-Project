'use client';

import Link from 'next/link';
import { useState, FormEvent } from 'react';
import { useAuth } from './context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const { user, signUp, signIn, error } = useAuth();
  
  // Form states
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  
  // Error states
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [signInError, setSignInError] = useState<string | null>(null);

  // Loading states
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Handle sign up submission
  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setSignUpError(null);
    setIsSigningUp(true);
    
    try {
      await signUp(signUpEmail, signUpPassword);
      // You could redirect the user or show a success message
      router.push('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        setSignUpError(error.message);
      } else {
        setSignUpError('An error occurred during sign up');
      }
    } finally {
      setIsSigningUp(false);
    }
  };

  // Handle sign in submission
  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setSignInError(null);
    setIsSigningIn(true);
    
    try {
      await signIn(signInEmail, signInPassword);
      // Redirect the user after successful sign in
      router.push('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        setSignInError(error.message);
      } else {
        setSignInError('An error occurred during sign in');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with dark blue background */}
      <header className="bg-[#1A237E] text-white py-6">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold">PC Part Picker</h1>
        </div>
      </header>

      {/* Navigation bar with slightly lighter blue */}
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
      <main className="flex-grow bg-white py-8">
        <div className="container mx-auto px-4 flex justify-center items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            {/* Create Account Card */}
            <div className="bg-gray-50 rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-black mb-6 text-center">Create your new account</h2>
              {signUpError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {signUpError}
                </div>
              )}
              <form className="space-y-4" onSubmit={handleSignUp}>
                <div>
                  <input 
                    type="email" 
                    placeholder="Email" 
                    className="w-full px-4 py-2 border rounded-full text-black"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <input 
                    type="text" 
                    placeholder="Username" 
                    className="w-full px-4 py-2 border rounded-full text-black"
                    value={signUpUsername}
                    onChange={(e) => setSignUpUsername(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <input 
                    type="password" 
                    placeholder="Password" 
                    className="w-full px-4 py-2 border rounded-full text-black"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full py-3 bg-[#0D47A1] text-white rounded-full font-medium hover:bg-[#1565C0] transition-colors"
                  disabled={isSigningUp}
                >
                  {isSigningUp ? 'Registering...' : 'Register'}
                </button>
              </form>
            </div>

            {/* Sign In Card */}
            <div className="bg-gray-50 rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-black mb-6 text-center">Sign In</h2>
              {signInError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {signInError}
                </div>
              )}
              <form className="space-y-4" onSubmit={handleSignIn}>
                <div>
                  <input 
                    type="email" 
                    placeholder="Email" 
                    className="w-full px-4 py-2 border rounded-full text-black"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <input 
                    type="password" 
                    placeholder="Password" 
                    className="w-full px-4 py-2 border rounded-full text-black"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full py-3 bg-[#0D47A1] text-white rounded-full font-medium hover:bg-[#1565C0] transition-colors"
                  disabled={isSigningIn}
                >
                  {isSigningIn ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
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