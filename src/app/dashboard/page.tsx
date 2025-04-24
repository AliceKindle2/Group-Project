'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart } from 'lucide-react';

export default function Dashboard() {
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
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-[#1A237E] to-[#3949AB] rounded-lg shadow-md p-8 max-w-4xl mx-auto mb-8 text-white">
            <h2 className="text-3xl font-semibold mb-3">Welcome to PC Part Picker</h2>
            <p className="text-lg mb-4">Build your dream PC with confidence using our advanced compatibility tools and real-time price tracking. Our platform helps you create a customized computer that perfectly matches your performance needs and budget constraints.</p>
            <p className="mb-4">With PC Part Picker, you'll never have to worry about incompatible components or overpaying for parts. Our intelligent system checks compatibility across all components, suggests alternatives, and finds the best prices from trusted retailers.</p>
            <Link href="/project">
              <button className="mt-4 bg-white text-[#1A237E] hover:bg-gray-100 px-6 py-2 rounded-full transition-colors font-medium">
                Start Building Your Custom PC
              </button>
            </Link>
          </div>
          
          {/* Featured Content */}
          <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto mb-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4 text-center">Featured Builds</h2>
            <p className="text-gray-600 text-center max-w-3xl mx-auto mb-8">Explore our curated selection of optimized PC builds for different needs and budgets. Each build has been carefully crafted to provide the best performance-to-price ratio and ensures full compatibility between all components.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Featured Build 1 */}
              <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <img src="/images/pc1.jpg" alt="High-End Gaming PC" className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Ultimate Gaming Build</h3>
                  <p className="text-gray-600 text-sm mb-3">Experience gaming at its finest with this no-compromise build featuring AMD's latest Ryzen 9 9950X processor paired with NVIDIA's flagship RTX 4090 GPU. With 64GB of high-speed DDR5 memory and 4TB of NVMe storage, this system handles any game at max settings with ease.</p>
                  <div className="space-y-1 mb-3">
                    <p className="text-gray-600 text-sm"><span className="font-medium">CPU:</span> AMD Ryzen 9 9950X (16-core, 32-thread)</p>
                    <p className="text-gray-600 text-sm"><span className="font-medium">GPU:</span> NVIDIA RTX 4090 24GB GDDR6X</p>
                    <p className="text-gray-600 text-sm"><span className="font-medium">RAM:</span> 64GB DDR5-6000 (2x32GB)</p>
                    <p className="text-gray-600 text-sm"><span className="font-medium">Storage:</span> 4TB NVMe PCIe 5.0 SSD</p>
                  </div>
                  <p className="text-[#3949AB] font-medium">$3,499.99</p>
                </div>
              </div>
              
              {/* Featured Build 2 */}
              <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <img src="/images/pc2.jpg" alt="Mid-Range Workstation" className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Content Creator Workstation</h3>
                  <p className="text-gray-600 text-sm mb-3">Designed specifically for video editing, 3D rendering, and other creative workloads, this balanced system provides excellent multi-threaded performance. The Intel Core i7-14700K and RTX 4070 combination delivers smooth performance in demanding applications like Adobe Premiere Pro, DaVinci Resolve, and Blender.</p>
                  <div className="space-y-1 mb-3">
                    <p className="text-gray-600 text-sm"><span className="font-medium">CPU:</span> Intel Core i7-14700K (20-core, 28-thread)</p>
                    <p className="text-gray-600 text-sm"><span className="font-medium">GPU:</span> NVIDIA RTX 4070 12GB GDDR6X</p>
                    <p className="text-gray-600 text-sm"><span className="font-medium">RAM:</span> 32GB DDR5-5600 (2x16GB)</p>
                    <p className="text-gray-600 text-sm"><span className="font-medium">Storage:</span> 2TB NVMe PCIe 4.0 SSD</p>
                  </div>
                  <p className="text-[#3949AB] font-medium">$1,899.99</p>
                </div>
              </div>
              
              {/* Featured Build 3 */}
              <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <img src="/images/pc3.jpg" alt="Budget Gaming PC" className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Budget Champion</h3>
                  <p className="text-gray-600 text-sm mb-3">Proof that great gaming doesn't have to break the bank. This cost-effective build focuses on delivering excellent 1080p gaming performance with high refresh rates. Perfect for competitive titles like Valorant, Fortnite, and Apex Legends while still handling AAA games at medium to high settings.</p>
                  <div className="space-y-1 mb-3">
                    <p className="text-gray-600 text-sm"><span className="font-medium">CPU:</span> AMD Ryzen 5 8600 (6-core, 12-thread)</p>
                    <p className="text-gray-600 text-sm"><span className="font-medium">GPU:</span> AMD Radeon RX 7600 8GB GDDR6</p>
                    <p className="text-gray-600 text-sm"><span className="font-medium">RAM:</span> 16GB DDR5-5200 (2x8GB)</p>
                    <p className="text-gray-600 text-sm"><span className="font-medium">Storage:</span> 1TB NVMe PCIe 4.0 SSD</p>
                  </div>
                  <p className="text-[#3949AB] font-medium">$999.99</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-600 mb-4">Want to see more pre-configured builds for different use cases like home office, streaming, or compact gaming? Explore our complete collection and use them as starting points for your own custom configuration.</p>
              <Link href="/project">
                <button className="bg-[#303F9F] hover:bg-[#1A237E] text-white px-6 py-2 rounded-full transition-colors font-medium">
                  View All Builds
                </button>
              </Link>
            </div>
          </div>
          
          {/* Current Market Trends */}
          <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto mb-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4 text-center">Current PC Component Market</h2>
            <p className="text-gray-600 text-center max-w-3xl mx-auto mb-8">Our analysis of the current PC component market to help you make informed purchasing decisions. These insights are updated regularly to reflect the latest trends in availability and pricing.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Price Trends</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    <div>
                      <p className="text-gray-800 font-medium">GPU Prices Decreasing</p>
                      <p className="text-gray-600 text-sm">After recent releases, previous generation GPUs have seen significant price drops, making them excellent value options.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-red-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    <div>
                      <p className="text-gray-800 font-medium">DDR5 RAM Premium</p>
                      <p className="text-gray-600 text-sm">DDR5 memory continues to command a premium, though prices are gradually decreasing as adoption increases.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-yellow-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                    </svg>
                    <div>
                      <p className="text-gray-800 font-medium">SSD Price Stability</p>
                      <p className="text-gray-600 text-sm">SSD prices have stabilized after previous fluctuations, with larger capacities offering better value per gigabyte.</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Upcoming Releases</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-8 h-8 bg-[#3949AB] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-white font-bold">Q2</span>
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">AMD Refresh</p>
                      <p className="text-gray-600 text-sm">AMD expected to release refreshed CPUs with improved clock speeds and efficiency in Q2 2025.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-8 h-8 bg-[#3949AB] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-white font-bold">Q3</span>
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">Budget GPUs</p>
                      <p className="text-gray-600 text-sm">New entry-level and mid-range graphics cards expected from both NVIDIA and AMD in Q3 2025.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-8 h-8 bg-[#3949AB] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-white font-bold">Q4</span>
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">PCIe 6.0 Adoption</p>
                      <p className="text-gray-600 text-sm">First motherboards with PCIe 6.0 support expected to arrive in late 2025.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="text-center">
              <Link href="/project">
                <button className="bg-[#303F9F] hover:bg-[#1A237E] text-white px-6 py-2 rounded-full transition-colors font-medium">
                  Start Planning Your Build
                </button>
              </Link>
            </div>
          </div>
          
          {/* PC Building Guide Section */}
          <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4 text-center">The Ultimate PC Building Guide</h2>
            <p className="text-gray-600 text-center max-w-3xl mx-auto mb-8">From selecting your first component to powering on your completed build, our comprehensive guide covers everything you need to know about building a custom PC in 2025.</p>
            
            <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
              <div className="md:w-1/2">
                <img src="/images/pc4.jpg" alt="PC Building Process" className="rounded-lg shadow-sm w-full h-auto" />
              </div>
              <div className="md:w-1/2">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Getting Started: The Basics</h3>
                <p className="text-gray-600 mb-4">
                  Building your own PC might seem intimidating at first, but it's actually quite straightforward once you understand the basic components and how they work together. In this guide, we'll break down the entire process into simple, manageable steps that anyone can follow.
                </p>
                <p className="text-gray-600 mb-4">
                  You'll learn about choosing compatible components, effective budgeting strategies, optimal component selection based on your specific needs, and assembly techniques that professional builders use. Our step-by-step instructions include detailed photos and troubleshooting tips to ensure your build goes smoothly.
                </p>
                <Link href="/project">
                  <button className="bg-[#303F9F] hover:bg-[#1A237E] text-white px-5 py-2 rounded-full transition-colors text-sm font-medium">
                    Read Our Complete Guide
                  </button>
                </Link>
              </div>
            </div>
            
            {/* Components Overview */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Understanding PC Components</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">Processor (CPU)</h4>
                  <p className="text-gray-600 text-sm">The brain of your computer that processes instructions. Key considerations include core count, clock speed, and thermal design power (TDP). AMD and Intel offer competitive options across different price points.</p>
                </div>
                
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">Graphics Card (GPU)</h4>
                  <p className="text-gray-600 text-sm">Handles rendering images, videos, and animations. Particularly important for gaming, video editing, and 3D modeling. Consider VRAM capacity, power requirements, and physical size for your case.</p>
                </div>
                
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">Motherboard</h4>
                  <p className="text-gray-600 text-sm">The main circuit board that connects all components. Must be compatible with your CPU socket type. Consider form factor, expansion slots, memory support, and connectivity options.</p>
                </div>
                
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">Memory (RAM)</h4>
                  <p className="text-gray-600 text-sm">Temporary storage for active programs and data. More RAM allows for multitasking with demanding applications. Consider capacity, speed (MHz), and latency timings for optimal performance.</p>
                </div>
                
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">Storage</h4>
                  <p className="text-gray-600 text-sm">SSDs provide fast boot times and load programs quickly, while HDDs offer more affordable bulk storage. Consider a combination of both for the best balance of speed and capacity.</p>
                </div>
                
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">Power Supply (PSU)</h4>
                  <p className="text-gray-600 text-sm">Provides power to all components. Choose a reliable, efficient unit with sufficient wattage for your components. Modular designs make cable management easier.</p>
                </div>
              </div>
            </div>
            
            {/* Quick Tips */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Essential Tips for First-Time Builders</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#3949AB] rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Double-Check Compatibility</h4>
                    <p className="text-gray-600 text-sm">Ensure your CPU, motherboard, and RAM are compatible. Check socket types, chipset support, and memory specifications. PC Part Picker's compatibility checker automatically verifies these critical relationships for you.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#3949AB] rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Don't Overlook Memory Performance</h4>
                    <p className="text-gray-600 text-sm">RAM speed and capacity significantly impact system performance. For gaming, 16GB is the current sweet spot, while content creation benefits from 32GB or more. Enable XMP/DOCP in BIOS to ensure your RAM runs at its advertised speed.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#3949AB] rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Invest in a Quality Power Supply</h4>
                    <p className="text-gray-600 text-sm">A high-quality PSU is critical for system stability and longevity. Choose a unit with 80+ Gold certification or better from a reputable manufacturer. Calculate your total system power requirements and add 20-30% headroom for future upgrades.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#3949AB] rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Plan Your Cooling Solution Carefully</h4>
                    <p className="text-gray-600 text-sm">Proper cooling ensures component longevity and optimal performance. For stock or mild overclocking, quality air coolers work well. For high-performance builds or significant overclocking, consider AIO liquid cooling. Ensure your case has adequate airflow with strategic fan placement.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#3949AB] rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-white font-bold">5</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Case Size and Clearance Matter</h4>
                    <p className="text-gray-600 text-sm">Verify that your case can accommodate your components, especially GPU length, CPU cooler height, and radiator mounting options. Larger cases are easier to build in and typically offer better airflow, but may not fit in all spaces.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#3949AB] rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-white font-bold">6</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Cable Management is Worth the Effort</h4>
                    <p className="text-gray-600 text-sm">Taking time to route cables neatly improves airflow, reduces dust accumulation, and makes future upgrades easier. Use cable ties, routing channels, and consider a modular power supply to minimize cable clutter.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* CTA Button */}
            <div className="text-center">
              <p className="text-gray-600 mb-6">Ready to create your custom PC? Our comprehensive system builder walks you through each component choice, ensures compatibility, and helps you find the best prices on parts that match your performance needs and budget constraints.</p>
              <Link href="/project">
                <button className="bg-[#303F9F] hover:bg-[#1A237E] text-white px-8 py-3 rounded-lg transition-colors font-medium">
                  Start Your PC Build Now
                </button>
              </Link>
            </div>
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