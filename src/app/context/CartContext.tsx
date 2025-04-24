import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types
interface Part {
  id: string;
  name: string;
  price: number;
  category: string;
  rating?: number;
  description?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  budget: number | string;
  category: string;
  parts: Part[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface CartProject extends Project {
  total: number;
}

interface CartContextType {
  cartProjects: CartProject[];
  addProjectToCart: (project: Project) => void;
  removeProjectFromCart: (projectId: string) => void;
  clearCart: () => void;
  isInCart: (projectId: string) => boolean;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartProjects, setCartProjects] = useState<CartProject[]>([]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('pcPartFinderCart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart, (key, value) => {
          // Convert date strings back to Date objects
          if (key === 'createdAt' || key === 'updatedAt') {
            return new Date(value);
          }
          return value;
        });
        setCartProjects(parsedCart);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pcPartFinderCart', JSON.stringify(cartProjects));
  }, [cartProjects]);

  // Calculate total price of all parts in a project
  const calculateProjectTotal = (project: Project): number => {
    if (!project.parts || project.parts.length === 0) {
      return 0;
    }
    
    return project.parts.reduce((total, part) => {
      const price = typeof part.price === 'number' 
        ? part.price 
        : parseFloat(part.price.toString().replace('$', '').replace(',', ''));
      return total + price;
    }, 0);
  };

  // Add a project to cart
  const addProjectToCart = (project: Project) => {
    // Normalize project data
    const normalizedProject = {
      ...project,
      // Convert budget to number if it's a string
      budget: typeof project.budget === 'string' 
        ? parseFloat(project.budget.replace('$', '').replace(',', '')) || 0
        : project.budget,
      // Normalize parts data
      parts: project.parts.map(part => ({
        ...part,
        // Convert price to number if it's a string
        price: typeof part.price === 'number'
          ? part.price
          : parseFloat(part.price.toString().replace('$', '').replace(',', ''))
      }))
    };
    
    const total = calculateProjectTotal(normalizedProject);
    
    // Check if project is already in cart
    const existingIndex = cartProjects.findIndex(p => p.id === project.id);
    
    if (existingIndex >= 0) {
      // Update existing project
      const updatedCart = [...cartProjects];
      updatedCart[existingIndex] = { ...normalizedProject, total };
      setCartProjects(updatedCart);
    } else {
      // Add new project
      setCartProjects([...cartProjects, { ...normalizedProject, total }]);
    }
  };

  // Remove a project from cart
  const removeProjectFromCart = (projectId: string) => {
    setCartProjects(cartProjects.filter(project => project.id !== projectId));
  };

  // Clear the entire cart
  const clearCart = () => {
    setCartProjects([]);
  };

  // Check if a project is in the cart
  const isInCart = (projectId: string): boolean => {
    return cartProjects.some(project => project.id === projectId);
  };

  // Calculate grand total of all projects in cart
  const getCartTotal = (): number => {
    return cartProjects.reduce((sum, project) => sum + project.total, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartProjects,
        addProjectToCart,
        removeProjectFromCart,
        clearCart,
        isInCart,
        getCartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
