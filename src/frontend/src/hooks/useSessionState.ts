import { useState, useEffect, useCallback } from 'react';
import { getStorageItem, setStorageItem } from '../lib/localStorage';

interface SessionStateData<T> {
  state: T;
  sessionId: string;
  createdAt: number;
}

const STORAGE_KEY = 'app_sessionState_v1';
const SESSION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function useSessionState<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState);
  const [sessionId] = useState(() => {
    const existing = getStorageItem<SessionStateData<T>>(STORAGE_KEY);
    return existing?.sessionId || generateSessionId();
  });

  // Load state on mount
  useEffect(() => {
    const data = getStorageItem<SessionStateData<T>>(STORAGE_KEY);
    if (data && data.sessionId === sessionId) {
      setState(data.state);
    }
  }, [sessionId]);

  // Save state to localStorage
  const updateState = useCallback((newState: T | ((prev: T) => T)) => {
    setState(prevState => {
      const nextState = typeof newState === 'function' 
        ? (newState as (prev: T) => T)(prevState)
        : newState;

      setStorageItem<SessionStateData<T>>(
        STORAGE_KEY,
        {
          state: nextState,
          sessionId,
          createdAt: Date.now(),
        },
        { expiresIn: SESSION_EXPIRY }
      );

      return nextState;
    });
  }, [sessionId]);

  return [state, updateState] as const;
}
