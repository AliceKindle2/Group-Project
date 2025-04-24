'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  message: string;
  subject: string;
}

export default function ContactPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  // Pre-fill form data with user info if available
  useEffect(() => {
    if (user && user.email) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        name: user.displayName || ''
      }));
    }
  }, [user]);

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
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      setSubmitSuccess(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: user?.displayName || '',
          email: user?.email || '',
          subject: '',
          message: ''
        });
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-semibold text-black mb-2">Contact Us</h2>
              <p className="text-black">Have questions or feedback? Get in touch with our team.</p>
            </div>
            
            {submitSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center mb-6">
                <div className="text-green-600 text-xl font-medium mb-2">Message Sent Successfully!</div>
                <p className="text-green-700">Thank you for contacting us. We'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-black font-medium mb-2">Your Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#303F9F] text-black ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-black font-medium mb-2">Your Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#303F9F] text-black ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>
                
                {/* Subject Field */}
                <div>
                  <label htmlFor="subject" className="block text-black font-medium mb-2">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#303F9F] text-black ${
                      errors.subject ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="How can we help you?"
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                  )}
                </div>
                
                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-black font-medium mb-2">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#303F9F] text-black ${
                      errors.message ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Please describe your question or feedback in detail..."
                  ></textarea>
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                  )}
                </div>
                
                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#303F9F] hover:bg-[#1A237E] text-white px-6 py-3 rounded-lg transition-colors font-medium"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sending...
                      </span>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </div>
              </form>
            )}
            
            {/* Contact Information */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-black mb-4">Other Ways to Contact Us</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-5 rounded-lg text-center">
                  <div className="w-12 h-12 bg-[#3949AB] rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-black mb-1">Phone</h4>
                  <p className="text-black">(123) 456-7890</p>
                </div>
                
                <div className="bg-gray-50 p-5 rounded-lg text-center">
                  <div className="w-12 h-12 bg-[#3949AB] rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-black mb-1">Customer Care</h4>
                  <p className="text-black">support@pcpartpicker.com</p>
                </div>
                
                <div className="bg-gray-50 p-5 rounded-lg text-center">
                  <div className="w-12 h-12 bg-[#3949AB] rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-black mb-1">Address</h4>
                  <p className="text-black">800 W Campbell Rd, Richardson, TX 75080</p>
                </div>
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