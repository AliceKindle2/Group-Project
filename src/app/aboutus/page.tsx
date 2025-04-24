'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart } from 'lucide-react';

export default function AboutUsPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Redirect if user is not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (dropdownOpen) setDropdownOpen(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="bg-[#1A237E] text-white py-6">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold">PC Part Picker</h1>
          </div>
        </header>
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#303F9F] border-t-[#1A237E] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // If user is not authenticated, don't render anything (will redirect)
  if (!user) {
    return null;
  }

  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: 'Alice Askerup',
      role: 'Project Manager',
      bio: 'Experienced in project management',
      image: '/images/alice.png'
    },
    {
      id: 2,
      name: 'Anmol Sahota',
      role: 'Frontend Developer',
      bio: 'Experienced in FrontEnd Developement',
      image: '/images/anmol.png'
    },
    {
      id: 3,
      name: 'Amanda Contreras',
      role: 'Full Stack Developer',
      bio: 'Experienced in Full Stack Developement.',
      image: '/images/amanda.png'
    },
    {
      id: 4,
      name: 'Aliza Karachiwalla',
      role: 'Full Stack Developer',
      bio: 'Experienced in Full Stack Developement.',
      image: '/images/aliza.png'
    },
    {
      id: 5,
      name: 'Ali Rehman',
      role: 'Backend Developer',
      bio: 'Experienced in Backend Developement.',
      image: '/images/ali.png'
    }
    ,{
      id: 6,
      name: 'Amy Valdivia',
      role: 'Frontend',
      bio: 'Experienced in Frontend Developement.',
      image: '/images/amy.png'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with dark blue background and user menu + cart in top right */}
      <header className="bg-[#1A237E] text-white py-6 relative">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">PC Part Picker</h1>
            
            <div className="flex items-center space-x-4">
              {/* Cart Button with Icon */}
              <Link href="/cart">
                <button className="bg-[#3949AB] hover:bg-[#303F9F] text-white p-2 rounded-full transition-colors flex items-center justify-center">
                  <ShoppingCart size={20} />
                </button>
              </Link>
              
              {/* User Profile Dropdown */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={toggleDropdown}
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

      {/* Navigation bar with links */}
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
          {/* About Us Section */}
          <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto mb-8">
            <h2 className="text-3xl font-semibold text-black mb-6">About PC Part Picker</h2>
            
            <div className="space-y-6 text-black">
              <p className="leading-relaxed">
                PC Part Picker was founded in 2025 with a simple mission: to make building custom PCs accessible to everyone. 
                Whether you're a seasoned builder or assembling your first computer, our platform helps you find the right 
                components that work perfectly together while staying within your budget.
              </p>
              
              <p className="leading-relaxed">
                What sets us apart is our commitment to comprehensive compatibility checking and real-time price comparisons. 
                Our advanced algorithms ensure that every component you select will work seamlessly with the rest of your build, 
                eliminating the frustration of returns and exchanges due to incompatibility issues.
              </p>
              
              <div className="flex flex-col md:flex-row gap-8 my-8 items-center">
                <div className="md:w-1/2">
                  <img 
                    src="images/pc4.jpeg" 
                    alt="PC Build Example" 
                    className="rounded-lg shadow-md w-full h-auto"
                  />
                </div>
                <div className="md:w-1/2">
                  <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
                  <p className="leading-relaxed">
                    We envision a world where anyone can build their perfect computer without the traditional 
                    barriers of technical knowledge and compatibility concerns. By democratizing the PC building 
                    process, we aim to empower users to create systems that perfectly match their needs and preferences.
                  </p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <h3 className="text-xl font-semibold text-black mb-3">Why Choose PC Part Picker?</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-[#3949AB] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Advanced compatibility checking that catches issues other platforms miss</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-[#3949AB] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Real-time price tracking from multiple retailers to find the best deals</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-[#3949AB] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Personalized recommendations based on your specific needs and budget</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-[#3949AB] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Community features to share builds and get feedback from experienced builders</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Our Team Section */}
          <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-black mb-8">Our Team</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {teamMembers.map(member => (
                <div key={member.id} className="bg-gray-50 rounded-lg p-6 flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-24 h-24 rounded-full object-cover border-4 border-[#303F9F]"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-black">{member.name}</h3>
                    <p className="text-[#3949AB] font-medium mb-2">{member.role}</p>
                    <p className="text-black text-sm">{member.bio}</p>
                  </div>
                </div>
              ))}
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