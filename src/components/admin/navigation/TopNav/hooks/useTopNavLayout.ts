
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUIStore } from '@/stores/ui';
import { UseTopNavLayoutReturn } from '../types';

export const useTopNavLayout = (): UseTopNavLayoutReturn => {
  const [isExtended, setIsExtended] = useState(true);
  const location = useLocation();
  const { layout } = useUIStore();
  const { adminIconOnly } = layout;

  // Reset extended state when route changes
  useEffect(() => {
    setIsExtended(true);
  }, [location.pathname]);

  const toggleExtended = () => {
    setIsExtended(prev => !prev);
  };

  return {
    isExtended,
    iconOnly: adminIconOnly,
    toggleExtended
  };
};
