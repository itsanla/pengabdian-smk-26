'use client';

import { useEffect, useRef, useState, ReactNode, ComponentType } from 'react';

interface LazyLoadProps {
  children: ReactNode;
  fallback: ReactNode;
  rootMargin?: string;
  threshold?: number;
}

/**
 * LazyLoad component that renders a fallback (skeleton) until the section 
 * is near the viewport, then renders the actual content.
 */
export const LazyLoad = ({ 
  children, 
  fallback, 
  rootMargin = '200px',
  threshold = 0.01 
}: LazyLoadProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [rootMargin, threshold]);

  return (
    <div ref={ref}>
      {isVisible ? children : fallback}
    </div>
  );
};

export default LazyLoad;
