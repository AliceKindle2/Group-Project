'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function PaymentSuccessPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }

    const timeout = setTimeout(() => {
      router.push('/dashboard');
    }, 5000);

    return () => clearTimeout(timeout);
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-black">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-[#1A237E] text-white py-6 relative">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">PC Part Finder</h1>
          <Link href="/cart">
            <button className="bg-[#3949AB] hover:bg-[#303F9F] text-white p-2 rounded-full">
              <ShoppingCart size={20} />
            </button>
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow bg-gray-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8">
            <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">
              Thank you for your order. Your payment has been processed.
            </p>
            <p className="text-gray-500 mb-6">
              You'll be redirected to your dashboard shortly.
            </p>
            <Link href="/dashboard">
              <button className="bg-[#303F9F] hover:bg-[#1A237E] text-white px-6 py-3 rounded-full font-medium transition">
                Go to Dashboard Now
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1A237E] text-white py-4 text-center">
        <p>&copy; {new Date().getFullYear()} PC Part Finder. All rights reserved.</p>
      </footer>
    </div>
  );
}
