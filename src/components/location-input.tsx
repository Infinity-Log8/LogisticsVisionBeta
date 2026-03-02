'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { mockLocations } from '@/data/locations';
import { cn } from '@/lib/utils';

interface LocationInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function LocationInput({
  value = '',
  onChange,
  placeholder = 'Enter city, address or region...',
  disabled = false,
  className,
  id,
}: LocationInputProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const suggestions = inputValue.length >= 1
    ? mockLocations.filter((loc) =>
        loc.label.toLowerCase().includes(inputValue.toLowerCase())
      ).slice(0, 8)
    : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onChange?.(val);
    setOpen(true);
  };

  const handleSelect = (label: string) => {
    setInputValue(label);
    onChange?.(label);
    setOpen(false);
  };

  const handleBlur = () => {
    // Delay to allow click on suggestion
    setTimeout(() => setOpen(false), 150);
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <Input
        id={id}
        value={inputValue}
        onChange={handleChange}
        onFocus={() => inputValue.length >= 1 && setOpen(true)}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
      />
      {open && suggestions.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-md border bg-popover shadow-md">
          {suggestions.map((loc) => (
            <button
              key={loc.value}
              type="button"
              className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground first:rounded-t-md last:rounded-b-md"
              onMouseDown={() => handleSelect(loc.label)}
            >
              {loc.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
