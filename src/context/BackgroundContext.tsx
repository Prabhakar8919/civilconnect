import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface BackgroundContextType {
  setBackground: (image: string | null, isHomePage?: boolean) => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [background, setBackgroundState] = useState<string | null>(null);
  const [isHomePage, setIsHomePage] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile devices
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const setBackground = (image: string | null, isHome: boolean = false) => {
    setBackgroundState(image);
    setIsHomePage(isHome);
  };

  // Determine background attachment based on page type and device
  const getBackgroundAttachment = () => {
    if (isHomePage) return 'scroll';
    if (isMobile) return 'scroll'; // Fixed backgrounds can be problematic on mobile
    return 'fixed';
  };

  return (
    <BackgroundContext.Provider value={{ setBackground }}>
      <div className="min-h-screen relative">
        {background && !isHomePage && (
          <>
            {/* Full-page static background - fixed for all non-home pages */}
            <div 
              className="fixed inset-0 w-full h-full -z-50"
              style={{ 
                backgroundImage: `url(${background})`,
                backgroundAttachment: getBackgroundAttachment(),
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh',
                minWidth: '100vw',
                width: '100%',
                height: '100%'
              }}
            />
            {/* Enhanced gradient overlay for better readability */}
            <div className="fixed inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60 -z-40" />
          </>
        )}
        {/* Home page keeps its own background handling */}
        {children}
      </div>
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
}