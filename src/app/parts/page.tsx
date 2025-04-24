'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

// Part type definition
interface Part {
  id: string;
  name: string;
  category: string;
  price: string;
  rating: number;
  description: string;
  imageUrl?: string;
}

// Project type definition (simplified from project page)
interface Project {
  id: string;
  name: string;
  parts?: Part[];
  createdAt: Date;
  updatedAt: Date;
  description: string;
  budget?: string;
  category?: string;
}

export default function PartsPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');
  
  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [parts, setParts] = useState<Part[]>([]);
  const [filteredParts, setFilteredParts] = useState<Part[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projectParts, setProjectParts] = useState<Part[]>([]);
  const [isAdding, setIsAdding] = useState<string | null>(null);

  // Load mock parts - in a real app, this would come from an API
  useEffect(() => {
    const mockParts: Part[] = [
      {
        id: 'cpu1',
        name: 'Intel Core i9-14900K',
        category: 'cpu',
        price: '$599.99',
        rating: 4.8,
        description: 'Latest generation Intel Core i9 processor with 24 cores and 32 threads'
      },
      {
        id: 'cpu2',
        name: 'AMD Ryzen 9 9950X',
        category: 'cpu',
        price: '$549.99',
        rating: 4.9,
        description: 'High-performance AMD processor with 16 cores and 32 threads'
      },
      {
        id: 'gpu1',
        name: 'NVIDIA RTX 4090',
        category: 'gpu',
        price: '$1,599.99',
        rating: 4.9,
        description: 'Flagship graphics card with 24GB GDDR6X memory'
      },
      {
        id: 'gpu2',
        name: 'AMD Radeon RX 7900 XTX',
        category: 'gpu',
        price: '$999.99',
        rating: 4.7,
        description: 'High-end AMD graphics card with 24GB GDDR6 memory'
      },
      {
        id: 'ram1',
        name: 'Corsair Vengeance 32GB DDR5',
        category: 'ram',
        price: '$149.99',
        rating: 4.8,
        description: 'High-speed DDR5 RAM kit (2x16GB)'
      },
      {
        id: 'ram2',
        name: 'G.Skill Trident Z5 64GB DDR5',
        category: 'ram',
        price: '$299.99',
        rating: 4.9,
        description: 'Premium RGB DDR5 RAM kit (2x32GB)'
      },
      {
        id: 'storage1',
        name: 'Samsung 990 PRO 2TB NVMe SSD',
        category: 'storage',
        price: '$179.99',
        rating: 4.9,
        description: 'Ultra-fast PCIe 4.0 NVMe SSD with up to 7,450 MB/s read speeds'
      },
      {
        id: 'storage2',
        name: 'WD Black 4TB HDD',
        category: 'storage',
        price: '$119.99',
        rating: 4.6,
        description: '7200 RPM performance hard drive for gaming and storage'
      },
      {
        id: 'case1',
        name: 'Lian Li O11 Dynamic EVO',
        category: 'case',
        price: '$169.99',
        rating: 4.8,
        description: 'Premium mid-tower case with excellent airflow and cable management'
      },
      {
        id: 'case2',
        name: 'Corsair 5000D Airflow',
        category: 'case',
        price: '$149.99',
        rating: 4.7,
        description: 'High-airflow mid-tower ATX case with tempered glass side panel'
      },
      {
        id: 'psu1',
        name: 'Corsair RM1000x',
        category: 'psu',
        price: '$189.99',
        rating: 4.8,
        description: '1000W fully modular power supply with 80+ Gold efficiency'
      },
      {
        id: 'psu2',
        name: 'EVGA SuperNOVA 850 G6',
        category: 'psu',
        price: '$129.99',
        rating: 4.7,
        description: '850W fully modular power supply with 80+ Gold certification'
      },
      {
        id: 'cooling1',
        name: 'NZXT Kraken X73',
        category: 'cooling',
        price: '$179.99',
        rating: 4.7,
        description: '360mm AIO liquid CPU cooler with RGB lighting'
      },
      {
        id: 'cooling2',
        name: 'Noctua NH-D15',
        category: 'cooling',
        price: '$99.99',
        rating: 4.9,
        description: 'High-performance dual-tower CPU air cooler'
      },
      {
        id: 'mb1',
        name: 'ASUS ROG Maximus Z790 Hero',
        category: 'motherboard',
        price: '$629.99',
        rating: 4.8,
        description: 'High-end ATX motherboard for Intel 12th/13th/14th gen CPUs'
      },
      {
        id: 'mb2',
        name: 'MSI MPG X870 CARBON WIFI',
        category: 'motherboard',
        price: '$499.99',
        rating: 4.7,
        description: 'Premium AMD AM5 motherboard with PCIe 5.0 and DDR5 support'
      }
    ];
    
    setParts(mockParts);
    setFilteredParts(mockParts);
  }, []);

  // Load the project if projectId is provided
  useEffect(() => {
    if (projectId) {
      try {
        // Get projects from localStorage
        const storedProjects = localStorage.getItem('pcPartFinderProjects');
        
        if (storedProjects) {
          // Parse the JSON string and convert date strings back to Date objects
          const parsedProjects = JSON.parse(storedProjects, (key, value) => {
            // Convert date strings back to Date objects
            if (key === 'createdAt' || key === 'updatedAt') {
              return new Date(value);
            }
            return value;
          });
          
          // Find the current project
          const project = parsedProjects.find((p: Project) => p.id === projectId);
          
          if (project) {
            setCurrentProject(project);
            setProjectParts(project.parts || []);
          } else {
            // Project not found, redirect back to projects page
            router.push('/project');
          }
        }
      } catch (error) {
        console.error('Error loading project:', error);
        router.push('/project');
      }
    }
  }, [projectId, router]);

  // Filter parts based on search term and category
  useEffect(() => {
    let filtered = parts;
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(part =>
        part.name.toLowerCase().includes(term) ||
        part.description.toLowerCase().includes(term)
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(part => part.category === selectedCategory);
    }
    
    setFilteredParts(filtered);
  }, [searchTerm, selectedCategory, parts]);

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

  // Handle adding a part to the project
  const handleAddPart = async (part: Part) => {
    if (!currentProject) return;
    
    setIsAdding(part.id);
    
    try {
      // Check if part is already added
      const isPartAlreadyAdded = projectParts.some(p => p.id === part.id);
      
      if (isPartAlreadyAdded) {
        alert('This part is already in your project');
        setIsAdding(null);
        return;
      }
      
      // Add part to project parts
      const updatedProjectParts = [...projectParts, part];
      setProjectParts(updatedProjectParts);
      
      // Get all projects
      const storedProjects = localStorage.getItem('pcPartFinderProjects');
      
      if (storedProjects) {
        const parsedProjects = JSON.parse(storedProjects, (key, value) => {
          if (key === 'createdAt' || key === 'updatedAt') {
            return new Date(value);
          }
          return value;
        });
        
        // Find and update the current project
        const updatedProjects = parsedProjects.map((p: Project) => {
          if (p.id === currentProject.id) {
            return {
              ...p,
              parts: updatedProjectParts,
              updatedAt: new Date()
            };
          }
          return p;
        });
        
        // Save back to localStorage
        localStorage.setItem('pcPartFinderProjects', JSON.stringify(updatedProjects));
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error('Error adding part:', error);
    }
    
    setIsAdding(null);
  };

  // Handle removing a part from the project
  const handleRemovePart = async (partId: string) => {
    if (!currentProject) return;
    
    try {
      // Remove part from project parts
      const updatedProjectParts = projectParts.filter(p => p.id !== partId);
      setProjectParts(updatedProjectParts);
      
      // Get all projects
      const storedProjects = localStorage.getItem('pcPartFinderProjects');
      
      if (storedProjects) {
        const parsedProjects = JSON.parse(storedProjects, (key, value) => {
          if (key === 'createdAt' || key === 'updatedAt') {
            return new Date(value);
          }
          return value;
        });
        
        // Find and update the current project
        const updatedProjects = parsedProjects.map((p: Project) => {
          if (p.id === currentProject.id) {
            return {
              ...p,
              parts: updatedProjectParts,
              updatedAt: new Date()
            };
          }
          return p;
        });
        
        // Save back to localStorage
        localStorage.setItem('pcPartFinderProjects', JSON.stringify(updatedProjects));
      }
    } catch (error) {
      console.error('Error removing part:', error);
    }
  };

  // Return to project page
  const handleReturnToProject = () => {
    router.push('/project');
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

  // If no project is selected, show error
  if (!currentProject && projectId) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="bg-[#1A237E] text-white py-6">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold">PC Part Picker</h1>
          </div>
        </header>
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-black mb-4">Project not found or invalid project ID</p>
            <button
              onClick={handleReturnToProject}
              className="bg-[#303F9F] hover:bg-[#1A237E] text-white px-5 py-2 rounded-lg transition-colors font-medium"
            >
              Return to Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with dark blue background and Sign Out button */}
      <header className="bg-[#1A237E] text-white py-6 relative">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold">PC Part Picker</h1>
          <button 
            onClick={handleLogout}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-[#E57373] hover:bg-[#EF5350] text-white px-4 py-2 rounded-full transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Navigation bar with links */}
      <nav className="bg-[#303F9F] text-white py-4">
        <div className="container mx-auto flex justify-center">
          <div className="flex space-x-0">
            <Link href="/dashboard" className="hover:underline px-4">Home</Link>
            <Link href="/project" className="hover:underline px-4">Projects</Link>
            <Link href="/contact" className="hover:underline px-4">Contact</Link>
            <Link href="/references" className="hover:underline px-4">References</Link>
            <Link href="/messages" className="hover:underline px-4">Messages</Link>
          </div>
        </div>
      </nav>

      {/* Main content with white background */}
      <main className="flex-grow bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          {currentProject && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold text-black">
                    <Link href="/project" className="text-[#303F9F] hover:underline">Projects</Link> {' > '}
                    <span className="text-black">{currentProject.name}</span>
                  </h2>
                  <p className="text-black mt-1">{currentProject.description}</p>
                </div>
                <button
                  onClick={handleReturnToProject}
                  className="bg-[#303F9F] hover:bg-[#1A237E] text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Back to Project
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Search and filters column */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-black mb-4">Search Parts</h3>
                
                {/* Search input */}
                <div className="mb-6">
                  <label htmlFor="search" className="block text-black font-medium mb-2">Search</label>
                  <input
                    type="text"
                    id="search"
                    placeholder="Search by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#303F9F] text-black"
                  />
                </div>
                
                {/* Category filter */}
                <div className="mb-6">
                  <label htmlFor="category" className="block text-black font-medium mb-2">Category</label>
                  <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#303F9F] bg-white text-black"
                  >
                    <option value="all">All Categories</option>
                    <option value="cpu">CPUs</option>
                    <option value="gpu">Graphics Cards</option>
                    <option value="motherboard">Motherboards</option>
                    <option value="ram">Memory (RAM)</option>
                    <option value="storage">Storage</option>
                    <option value="case">Cases</option>
                    <option value="psu">Power Supplies</option>
                    <option value="cooling">Cooling</option>
                  </select>
                </div>
                
                {/* Clear filters button */}
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-black"
                >
                  Clear Filters
                </button>
              </div>
            </div>
            
            {/* Parts list column */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-black">Available Parts</h3>
                  <span className="text-black">{filteredParts.length} parts found</span>
                </div>
                
                {/* Parts grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredParts.length > 0 ? (
                    filteredParts.map(part => (
                      <div key={part.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-lg font-medium text-black">{part.name}</h4>
                            <p className="text-black text-sm mb-2">{part.description}</p>
                            <div className="flex items-center mb-2">
                              <span className="text-black font-semibold">{part.price}</span>
                              <span className="mx-2 text-gray-300">|</span>
                              <span className="text-black text-sm capitalize">{part.category}</span>
                            </div>
                            <div className="flex items-center">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.floor(part.rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                                <span className="text-black text-sm ml-1">{part.rating.toFixed(1)}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleAddPart(part)}
                            className="bg-[#303F9F] hover:bg-[#1A237E] text-white px-3 py-1 rounded transition-colors text-sm flex items-center"
                            disabled={isAdding === part.id || projectParts.some(p => p.id === part.id)}
                          >
                            {isAdding === part.id ? (
                              <span className="flex items-center">
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                              </span>
                            ) : projectParts.some(p => p.id === part.id) ? (
                              'Added'
                            ) : (
                              'Add to Project'
                            )}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8">
                      <p className="text-black mb-2">No parts found matching your criteria</p>
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('all');
                        }}
                        className="text-[#303F9F] hover:underline"
                      >
                        Clear filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Selected parts section */}
          {currentProject && (
            <div className="bg-white rounded-lg shadow-md p-6 mt-8">
              <h3 className="text-xl font-semibold text-black mb-4">Selected Parts for {currentProject.name}</h3>
              
              {projectParts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Part</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Rating</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {projectParts.map(part => (
                        <tr key={part.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-black">{part.name}</div>
                            <div className="text-sm text-black">{part.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-black capitalize">{part.category}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-black">{part.price}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.floor(part.rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                                <span className="text-black text-sm ml-1">{part.rating.toFixed(1)}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleRemovePart(part.id)}
                              className="text-[#E57373] hover:text-[#EF5350]"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-black mb-4">No parts added to this project yet</p>
                  <p className="text-black">Browse and add parts from the list above</p>
                </div>
              )}
              
              {projectParts.length > 0 && (
                <div className="mt-6 flex justify-between items-center">
                  <div className="text-black font-semibold">
                    Total: ${projectParts.reduce((total, part) => total + parseFloat(part.price.replace('$', '').replace(',', '')), 0).toFixed(2)}
                  </div>
                  <button
                    onClick={handleReturnToProject}
                    className="bg-[#303F9F] hover:bg-[#1A237E] text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Save and Return to Project
                  </button>
                </div>
              )}
            </div>
          )}
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