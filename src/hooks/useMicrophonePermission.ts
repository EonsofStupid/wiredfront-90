
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

type PermissionState = 'prompt' | 'granted' | 'denied' | 'unsupported';

export function useMicrophonePermission() {
  const [permissionState, setPermissionState] = useState<PermissionState>('prompt');
  
  // Check if browser supports getUserMedia
  const isSupported = useCallback(() => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }, []);

  // Request microphone permission
  const requestPermission = useCallback(async () => {
    if (!isSupported()) {
      setPermissionState('unsupported');
      toast.error('Your browser does not support microphone access');
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Stop the tracks immediately after getting permission
      stream.getTracks().forEach(track => track.stop());
      
      setPermissionState('granted');
      localStorage.setItem('microphonePermission', 'granted');
      return true;
    } catch (error) {
      console.error('Microphone permission error:', error);
      setPermissionState('denied');
      localStorage.setItem('microphonePermission', 'denied');
      
      toast.error('Microphone access denied. Voice recording is unavailable.');
      return false;
    }
  }, [isSupported]);

  // Check existing permission on mount
  useEffect(() => {
    const checkInitialPermission = async () => {
      // First check localStorage for previous permission
      const savedPermission = localStorage.getItem('microphonePermission');
      
      if (savedPermission === 'granted') {
        setPermissionState('granted');
        return;
      } else if (savedPermission === 'denied') {
        setPermissionState('denied');
        return;
      }
      
      // If permission API is available, use it
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          
          setPermissionState(result.state as PermissionState);
          
          // Set up listener for permission changes
          result.addEventListener('change', () => {
            setPermissionState(result.state as PermissionState);
            localStorage.setItem('microphonePermission', result.state);
          });
        } catch (error) {
          console.error('Permission check error:', error);
          setPermissionState('prompt');
        }
      } else if (!isSupported()) {
        setPermissionState('unsupported');
      }
    };
    
    checkInitialPermission();
  }, [isSupported]);

  return {
    permissionState,
    isGranted: permissionState === 'granted',
    isDenied: permissionState === 'denied',
    isUnsupported: permissionState === 'unsupported',
    requestPermission
  };
}
