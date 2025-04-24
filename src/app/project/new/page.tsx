'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { ShoppingCart } from 'lucide-react';

interface FormData {
  name: string;
  description: string;
  budget: string;
  category: string;
}

export default function NewProjectPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    budget: '',
    category: 'gaming'
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear the error for this field when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    }
    
    if (formData.budget && isNaN(Number(formData.budget))) {
      newErrors.budget = 'Budget must be a number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create a new project object
      const newProject = {
        id: crypto.randomUUID(), // Generate a unique ID
        name: formData.name,
        description: formData.description,
        budget: formData.budget ? `$${formData.budget}` : 'Not specified',
        category: formData.category,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Get existing projects from localStorage or initialize empty array
      const existingProjects = JSON.parse(localStorage.getItem('pcPartFinderProjects') || '[]');
      
      // Add new project to array
      existingProjects.push(newProject);
      
      // Save updated array back to localStorage
      localStorage.setItem('pcPartFinderProjects', JSON.stringify(existingProjects));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect back to projects page
      router.push('/project');
    } catch (error) {
      console.error('Error creating project:', error);
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking authentication
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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with dark blue background and user menu + cart in top right */}
      <header className="bg-[#1A237E] text-white py-6 relative">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">PC Part Finder</h1>
            
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
          <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
            <div className="mb-6">
              <h2 className="text-3xl font-semibold text-black mb-2">Create New Project</h2>
              <p className="text-black">Set up your new PC build project and start finding parts</p>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Project Name */}
              <div className="mb-5">
                <label htmlFor="name" className="block text-black font-medium mb-2">Project Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#303F9F] text-black ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="E.g., Gaming PC Build 2025"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              
              {/* Project Description */}
              <div className="mb-5">
                <label htmlFor="description" className="block text-black font-medium mb-2">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#303F9F] min-h-[100px] text-black ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe your PC build project and any specific requirements"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>
              
              {/* Budget */}
              <div className="mb-5">
                <label htmlFor="budget" className="block text-black font-medium mb-2">Budget (Optional)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black">$</span>
                  <input
                    type="text"
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#303F9F] text-black ${
                      errors.budget ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your budget"
                  />
                </div>
                {errors.budget && (
                  <p className="text-red-500 text-sm mt-1">{errors.budget}</p>
                )}
              </div>
              
              {/* Category */}
              <div className="mb-8">
                <label htmlFor="category" className="block text-black font-medium mb-2">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#303F9F] bg-white text-black"
                >
                  <option value="gaming">Gaming PC</option>
                  <option value="workstation">Workstation</option>
                  <option value="homeserver">Home Server</option>
                  <option value="budget">Budget Build</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <Link 
                  href="/project" 
                  className="text-[#303F9F] hover:underline font-medium"
                >
                  Cancel
                </Link>
                <div className="space-x-4">
                  <button
                    type="button"
                    onClick={() => setFormData({
                      name: '',
                      description: '',
                      budget: '',
                      category: 'gaming'
                    })}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-black"
                    disabled={isSubmitting}
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    className="bg-[#303F9F] hover:bg-[#1A237E] text-white px-6 py-2 rounded-lg transition-colors font-medium"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Creating...
                      </span>
                    ) : (
                      'Create Project'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer with dark blue background */}
      <footer className="bg-[#1A237E] text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} PC Part Finder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}