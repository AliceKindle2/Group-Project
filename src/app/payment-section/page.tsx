'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart } from 'lucide-react';

export default function PaymentSectionPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (dropdownOpen) setDropdownOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen]);

  const handleCompletePayment = () => {
    localStorage.setItem('pcPartFinderProjects', JSON.stringify([]));
    router.push('/payment');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-[#303F9F] border-t-[#1A237E] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col text-black">
      <header className="bg-[#1A237E] text-white py-6 relative">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">PC Part Finder</h1>
          <div className="flex items-center gap-4">
            <Link href="/cart">
              <button className="bg-[#3949AB] hover:bg-[#303F9F] p-2 rounded-full">
                <ShoppingCart size={20} />
              </button>
            </Link>
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={toggleDropdown} className="bg-[#303F9F] px-4 py-2 rounded-full flex items-center">
                <div className="w-8 h-8 bg-[#1A237E] rounded-full flex items-center justify-center mr-2">
                  <span>{user.email?.charAt(0).toUpperCase()}</span>
                </div>
                <svg className={`h-4 w-4 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white text-black shadow-lg rounded-md py-1 z-10">
                  <Link href="/profile"><div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</div></Link>
                  <div className="border-t"></div>
                  <div onClick={handleLogout} className="px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer">Sign Out</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow bg-gray-100 py-10 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Payment</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Name on Card" className="w-full border px-4 py-2 rounded-md text-black" />
              <input type="text" placeholder="Card Number" className="w-full border px-4 py-2 rounded-md text-black" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Expiration (MM/YY)" className="border px-4 py-2 rounded-md text-black" />
                <input type="text" placeholder="CVC" className="border px-4 py-2 rounded-md text-black" />
              </div>
              <button
                onClick={handleCompletePayment}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium"
              >
                Confirm Payment
              </button>
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-[#1A237E] text-white py-4 text-center">
        <p>&copy; {new Date().getFullYear()} PC Part Finder. All rights reserved.</p>
      </footer>
    </div>
  );
}
