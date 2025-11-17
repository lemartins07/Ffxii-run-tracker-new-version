import { createContext, useContext, ReactNode } from 'react';

type Page = 'dashboard' | 'guide' | 'hunts' | 'about';

interface NavigationContextType {
  currentPage: Page;
  currentSectionCode: string;
  navigateTo: (page: Page, sectionCode?: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ 
  children, 
  value 
}: { 
  children: ReactNode; 
  value: NavigationContextType;
}) {
  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
