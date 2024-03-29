import { useState, useEffect } from "react";

function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handleValueChange = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handleValueChange);
    };
  }, [value]);

  return debouncedValue;
}

export { useDebounce };
