import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of your user object
export interface User {
  name: string;
  email: string;
  userId: number;
  role: 'client' | 'worker';
}

// Define the context value type
interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Context provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for accessing the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
