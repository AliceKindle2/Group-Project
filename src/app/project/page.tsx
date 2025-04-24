'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart } from 'lucide-react';

// Project type
interface Project {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  description: string;
  budget?: string;
  category?: string;
  parts?: Array<{
    id: string;
    name: string;
    category: string;
    price: string;
    rating: number;
    description: string;
  }>;
}

export default function ProjectPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // State for edit mode
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    budget: '',
    category: ''
  });

  // Fetch projects from localStorage
  useEffect(() => {
    if (user) {
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
          
          setProjects(parsedProjects);
        } else {
          // Initialize with empty array if no projects found
          setProjects([]);
        }
      } catch (error) {
        console.error('Error loading projects:', error);
        setProjects([]);
      }
    }
  }, [user]);

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

  // Handle creating a new project
  const handleCreateProject = () => {
    router.push('/project/new');
  };

  // Handle deleting a project
  const handleDeleteProject = async (projectId: string) => {
    setIsDeleting(projectId);
    
    try {
      // Filter out the project to delete
      const updatedProjects = projects.filter(project => project.id !== projectId);
      
      // Update state
      setProjects(updatedProjects);
      
      // Update localStorage
      localStorage.setItem('pcPartFinderProjects', JSON.stringify(updatedProjects));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
    
    setIsDeleting(null);
  };

  // Handle editing a project
  const handleEditProject = (projectId: string) => {
    // Find the project to edit
    const projectToEdit = projects.find(p => p.id === projectId);
    
    if (projectToEdit) {
      // Set the form data with the project's current values
      setEditForm({
        name: projectToEdit.name,
        description: projectToEdit.description,
        budget: projectToEdit.budget?.replace('$', '') || '',
        category: projectToEdit.category || 'gaming'
      });
      
      // Set the editing state to this project's ID
      setEditingProject(projectId);
    }
  };
  
  // Handle edit form changes
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Save edited project
  const handleSaveEdit = async (projectId: string) => {
    // Find project index
    const projectIndex = projects.findIndex(p => p.id === projectId);
    
    if (projectIndex !== -1) {
      // Create updated projects array
      const updatedProjects = [...projects];
      
      // Update the project
      updatedProjects[projectIndex] = {
        ...updatedProjects[projectIndex],
        name: editForm.name,
        description: editForm.description,
        budget: editForm.budget ? `$${editForm.budget}` : 'Not specified',
        category: editForm.category,
        updatedAt: new Date() // Update the updatedAt date
      };
      
      // Update state
      setProjects(updatedProjects);
      
      // Update localStorage
      localStorage.setItem('pcPartFinderProjects', JSON.stringify(updatedProjects));
      
      // Reset editing state
      setEditingProject(null);
    }
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingProject(null);
  };

  // Navigate to the parts page for a project
  const handleManageParts = (projectId: string) => {
    router.push(`/parts?projectId=${projectId}`);
  };

  // Calculate total parts cost for a project
  const calculateTotalCost = (project: Project) => {
    if (!project.parts || project.parts.length === 0) {
      return 0;
    }
    
    return project.parts.reduce((total, part) => {
      const price = parseFloat(part.price.replace('$', '').replace(',', ''));
      return total + price;
    }, 0);
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

  // Format date for display
  const formatDate = (date: Date) => {
    return date instanceof Date ? date.toLocaleDateString() : 'Invalid date';
  };

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
          <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-semibold text-black">Your Projects</h2>
              <button 
                onClick={handleCreateProject}
                className="bg-[#303F9F] hover:bg-[#1A237E] text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                Create New Project
              </button>
            </div>
            
            {/* Project List */}
            <div className="space-y-4">
              {projects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-black mb-4">You haven't created any projects yet</p>
                  <button 
                    onClick={handleCreateProject}
                    className="bg-[#303F9F] hover:bg-[#1A237E] text-white px-5 py-2 rounded-lg transition-colors font-medium"
                  >
                    Create Your First Project
                  </button>
                </div>
              ) : (
                projects.map(project => (
                  <div key={project.id} className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    {editingProject === project.id ? (
                      /* Edit Form */
                      <div className="space-y-4">
                        <div>
                          <label htmlFor={`edit-name-${project.id}`} className="block text-black font-medium mb-1">Project Name</label>
                          <input
                            type="text"
                            id={`edit-name-${project.id}`}
                            name="name"
                            value={editForm.name}
                            onChange={handleEditFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#303F9F] text-black"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor={`edit-description-${project.id}`} className="block text-black font-medium mb-1">Description</label>
                          <textarea
                            id={`edit-description-${project.id}`}
                            name="description"
                            value={editForm.description}
                            onChange={handleEditFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#303F9F] text-black min-h-[80px]"
                          />
                        </div>
                        
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label htmlFor={`edit-budget-${project.id}`} className="block text-black font-medium mb-1">Budget</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black">$</span>
                              <input
                                type="text"
                                id={`edit-budget-${project.id}`}
                                name="budget"
                                value={editForm.budget}
                                onChange={handleEditFormChange}
                                className="w-full px-3 py-2 pl-7 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#303F9F] text-black"
                              />
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <label htmlFor={`edit-category-${project.id}`} className="block text-black font-medium mb-1">Category</label>
                            <select
                              id={`edit-category-${project.id}`}
                              name="category"
                              value={editForm.category}
                              onChange={handleEditFormChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#303F9F] text-black"
                            >
                              <option value="gaming">Gaming PC</option>
                              <option value="workstation">Workstation</option>
                              <option value="homeserver">Home Server</option>
                              <option value="budget">Budget Build</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3 pt-2">
                          <button
                            onClick={handleCancelEdit}
                            className="px-4 py-1 border border-gray-300 rounded-md text-black hover:bg-gray-100"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(project.id)}
                            className="px-4 py-1 bg-[#303F9F] text-white rounded-md hover:bg-[#1A237E]"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Normal View */
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-black mb-2">
                            <Link href={`/parts?projectId=${project.id}`} className="text-black hover:text-[#303F9F] hover:underline">
                              {project.name}
                            </Link>
                          </h3>
                          <p className="text-black mb-3">{project.description}</p>
                          {project.budget && (
                            <p className="text-black mb-3">Budget: {project.budget}</p>
                          )}
                          {project.category && (
                            <p className="text-black mb-3">Category: {project.category.charAt(0).toUpperCase() + project.category.slice(1)}</p>
                          )}
                          
                          {/* Parts information */}
                          <div className="mt-3 mb-3">
                            <div className="flex items-center">
                              <p className="text-black">
                                <span className="font-medium">Parts:</span> {project.parts ? project.parts.length : 0} items
                                {project.parts && project.parts.length > 0 && (
                                  <span className="ml-2 font-medium">
                                    (Total: ${calculateTotalCost(project).toFixed(2)})
                                  </span>
                                )}
                              </p>
                              {(!project.parts || project.parts.length === 0) && (
                                <button
                                  onClick={() => handleManageParts(project.id)}
                                  className="ml-3 text-[#303F9F] text-sm hover:underline"
                                >
                                  Add parts
                                </button>
                              )}
                            </div>
                            
                            {project.parts && project.parts.length > 0 && (
                              <div className="mt-2">
                                <ul className="text-sm text-black">
                                  {project.parts.slice(0, 3).map(part => (
                                    <li key={part.id} className="mt-1">• {part.name}</li>
                                  ))}
                                  {project.parts.length > 3 && (
                                    <li className="mt-1 text-[#303F9F] hover:underline cursor-pointer">
                                      <Link href={`/parts?projectId=${project.id}`}>
                                        + {project.parts.length - 3} more parts
                                      </Link>
                                    </li>
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                          
                          <div className="text-sm text-black">
                            <p>Created: {formatDate(project.createdAt)}</p>
                            <p>Last updated: {formatDate(project.updatedAt)}</p>
                          </div>
                        </div>
                        <div className="space-x-2">
                          <button 
                            className="bg-[#3949AB] hover:bg-[#303F9F] text-white px-3 py-1 rounded transition-colors text-sm"
                            onClick={() => handleEditProject(project.id)}
                          >
                            Edit
                          </button>
                          <button 
                            className="bg-[#E57373] hover:bg-[#EF5350] text-white px-3 py-1 rounded transition-colors text-sm flex items-center justify-center"
                            onClick={() => handleDeleteProject(project.id)}
                            disabled={isDeleting === project.id}
                          >
                            {isDeleting === project.id ? (
                              <span className="flex items-center">
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                              </span>
                            ) : (
                              'Delete'
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
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