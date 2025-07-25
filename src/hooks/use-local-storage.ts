// src/hooks/use-local-storage.ts
"use client";

import { useState, useEffect, useCallback } from "react";

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    // This function is executed only on the initial render.
    try {
      const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.log(error);
      }
    },
    [key, storedValue]
  );
  
  // This effect synchronizes the value to localStorage when it changes.
  useEffect(() => {
    try {
       const item = window.localStorage.getItem(key);
       const currentValue = JSON.stringify(storedValue)
       if(item !== currentValue){
         window.localStorage.setItem(key, currentValue);
       }
    } catch(error){
        console.log(error);
    }
  }, [key, storedValue]);


  return [storedValue, setValue];
}

export default useLocalStorage;
