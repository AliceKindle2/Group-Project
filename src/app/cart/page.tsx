// src/app/cart/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart } from 'lucide-react';

interface Part {
  id: string;
  name: string;
  price: number | string;
  category: string;
  description?: string;
  rating?: number;
}

interface Project {
  id: string;
  name: string;
  description: string;
  budget: number | string;
  category: string;
  parts: Part[];
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function CartPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [grandTotal, setGrandTotal] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchProjects = () => {
      try {
        const storedProjects = localStorage.getItem('pcPartFinderProjects');
        if (storedProjects) {
          const parsedProjects = JSON.parse(storedProjects, (key, value) => {
            if (key === 'createdAt' || key === 'updatedAt') return new Date(value);
            return value;
          });

          const processedProjects = parsedProjects.map((project: any) => {
            const processedParts = (project.parts || []).map((part: any) => {
              const price = typeof part.price === 'string'
                ? parseFloat(part.price.replace('$', '').replace(',', ''))
                : part.price;
              return { ...part, price };
            });

            const total = processedParts.reduce((sum: number, part: Part) =>
              sum + (typeof part.price === 'number' ? part.price : 0), 0);

            return { ...project, parts: processedParts, total };
          });

          setProjects(processedProjects);
          const total = processedProjects.reduce((sum: number, project: Project) => sum + project.total, 0);
          setGrandTotal(total);
        } else {
          setProjects([]);
          setGrandTotal(0);
        }
        setPageLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
        setGrandTotal(0);
        setPageLoading(false);
      }
    };

    fetchProjects();
    window.addEventListener('storage', fetchProjects);
    return () => window.removeEventListener('storage', fetchProjects);
  }, [user, router]);

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
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleRemovePart = (projectId: string, partId: string) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        const updatedParts = project.parts.filter(part => part.id !== partId);
        const updatedTotal = updatedParts.reduce((sum, part) => {
          const price = typeof part.price === 'number' ? part.price : 0;
          return sum + price;
        }, 0);
        return { ...project, parts: updatedParts, total: updatedTotal };
      }
      return project;
    });

    setProjects(updatedProjects);
    const newGrandTotal = updatedProjects.reduce((sum, project) => sum + project.total, 0);
    setGrandTotal(newGrandTotal);

    try {
      const storedProjects = localStorage.getItem('pcPartFinderProjects');
      if (storedProjects) {
        const parsedProjects = JSON.parse(storedProjects);
        const updatedStoredProjects = parsedProjects.map((project: any) => {
          if (project.id === projectId) {
            const updatedParts = (project.parts || []).filter((part: any) => part.id !== partId);
            return { ...project, parts: updatedParts, updatedAt: new Date() };
          }
          return project;
        });
        localStorage.setItem('pcPartFinderProjects', JSON.stringify(updatedStoredProjects));
        window.dispatchEvent(new Event('storage'));
      }
    } catch (error) {
      console.error('Error updating localStorage:', error);
    }
  };

  const handleCheckout = () => {
    try {
      const storedProjects = localStorage.getItem('pcPartFinderProjects');
      if (storedProjects) {
        const parsedProjects = JSON.parse(storedProjects);
        const clearedProjects = parsedProjects.map((project: any) => ({
          ...project,
          parts: [],
          updatedAt: new Date()
        }));
        localStorage.setItem('pcPartFinderProjects', JSON.stringify(clearedProjects));
        window.dispatchEvent(new Event('storage'));
      }
    } catch (error) {
      console.error('Error clearing parts:', error);
    }
    router.push('/payment-section');
  };

  if (loading || pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-black">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-[#1A237E] text-white py-6 relative">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">PC Part Picker</h1>
          <Link href="/cart">
            <button className="bg-[#3949AB] hover:bg-[#303F9F] text-white p-2 rounded-full">
              <ShoppingCart size={20} />
            </button>
          </Link>
        </div>
      </header>

      <main className="flex-grow bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-black mb-8">Your Cart</h2>
            {projects.length === 0 || projects.every(p => p.parts.length === 0) ? (
              <div className="text-center p-10">
                <p className="text-xl text-black">Your cart is empty</p>
                <Link href="/project">
                  <button className="mt-4 bg-[#303F9F] hover:bg-[#1A237E] text-white px-6 py-2 rounded-full transition-colors">
                    Browse Projects
                  </button>
                </Link>
              </div>
            ) : (
              <>
                {projects.map((project) => (
                  <div key={project.id} className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-2xl font-semibold text-black">{project.name}</h3>
                      <Link href={`/project/${project.id}`}>
                        <button className="text-[#303F9F] hover:text-[#1A237E] font-medium">
                          View Project
                        </button>
                      </Link>
                    </div>
                    <p className="text-black mb-4">{project.description}</p>
                    <div className="mb-4">
                      <h4 className="font-medium text-lg text-black mb-3">Parts ({project.parts.length})</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="text-left p-3 border-b text-black">Name</th>
                              <th className="text-left p-3 border-b text-black">Category</th>
                              <th className="text-right p-3 border-b text-black">Price</th>
                              <th className="text-right p-3 border-b text-black">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {project.parts.map((part) => (
                              <tr key={part.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 text-black">{part.name}</td>
                                <td className="p-3 text-black">{part.category}</td>
                                <td className="p-3 text-right text-black">
                                  ${typeof part.price === 'number' ? part.price.toFixed(2) : parseFloat(part.price.toString().replace('$', '').replace(',', '')).toFixed(2)}
                                </td>
                                <td className="p-3 text-right">
                                  <button 
                                    onClick={() => handleRemovePart(project.id, part.id)}
                                    className="text-[#E57373] hover:text-[#EF5350] text-sm font-medium"
                                  >
                                    Remove
                                  </button>
                                </td>
                              </tr>
                            ))}
                            <tr className="font-bold bg-gray-100">
                              <td colSpan={2} className="p-3 text-right text-black">Total:</td>
                              <td className="p-3 text-right text-black">${project.total.toFixed(2)}</td>
                              <td></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="bg-[#F5F7FF] p-6 rounded-lg shadow-sm border border-[#E0E6FF]">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold text-black">Summary</h3>
                    <p className="text-2xl font-bold text-black">${grandTotal.toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-[#4CAF50] hover:bg-[#388E3C] text-white font-bold py-3 px-4 rounded-full transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-[#1A237E] text-white py-4 text-center">
        <p>&copy; {new Date().getFullYear()} PC Part Picker. All rights reserved.</p>
      </footer>
    </div>
  );
}
