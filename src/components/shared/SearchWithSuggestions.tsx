import React, { useState, useRef, useEffect } from 'react';
import { Search, Clock, X, ChevronDown } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';
import { cn } from '../ui/utils';

export interface SearchWithSuggestionsProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  suggestions?: string[];
  searchHistory?: string[];
  onClearHistory?: () => void;
  disabled?: boolean;
  showSuggestions?: boolean;
  maxSuggestions?: number;
  maxHistory?: number;
  className?: string;
  autoComplete?: boolean;
  onSuggestionSelect?: (suggestion: string) => void;
}

export function SearchWithSuggestions({
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
  suggestions = [],
  searchHistory = [],
  onClearHistory,
  disabled = false,
  showSuggestions = true,
  maxSuggestions = 6,
  maxHistory = 5,
  className,
  autoComplete = true,
  onSuggestionSelect
}: SearchWithSuggestionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayedSuggestions = suggestions.slice(0, maxSuggestions);
  const displayedHistory = searchHistory.slice(0, maxHistory);
  const totalItems = displayedSuggestions.length + displayedHistory.length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setSelectedIndex(-1);
    
    if (showSuggestions && (newValue.length > 0 || searchHistory.length > 0)) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleInputFocus = () => {
    if (showSuggestions && (value.length > 0 || searchHistory.length > 0)) {
      setIsOpen(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < totalItems - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          const allItems = [...displayedSuggestions, ...displayedHistory];
          const selectedItem = allItems[selectedIndex];
          if (selectedItem) {
            handleItemSelect(selectedItem);
          }
        } else if (value.trim()) {
          handleSubmit();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
      case 'Tab':
        if (selectedIndex >= 0 && autoComplete) {
          e.preventDefault();
          const allItems = [...displayedSuggestions, ...displayedHistory];
          const selectedItem = allItems[selectedIndex];
          if (selectedItem) {
            onChange(selectedItem);
          }
        }
        break;
    }
  };

  const handleItemSelect = (item: string) => {
    onChange(item);
    setIsOpen(false);
    setSelectedIndex(-1);
    onSuggestionSelect?.(item);
    onSearch?.(item);
  };

  const handleSubmit = () => {
    if (value.trim()) {
      onSearch?.(value.trim());
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  const handleClear = () => {
    onChange('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "pl-10 pr-20",
            value && "pr-20"
          )}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 p-0 hover:bg-muted"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
          {showSuggestions && (displayedSuggestions.length > 0 || displayedHistory.length > 0) && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="h-6 w-6 p-0 hover:bg-muted"
            >
              <ChevronDown className={cn(
                "h-3 w-3 transition-transform",
                isOpen && "rotate-180"
              )} />
              <span className="sr-only">Toggle suggestions</span>
            </Button>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && showSuggestions && (displayedSuggestions.length > 0 || displayedHistory.length > 0) && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-64 overflow-hidden shadow-lg">
          <CardContent className="p-0">
            <div className="max-h-64 overflow-y-auto">
              {/* Current Suggestions */}
              {displayedSuggestions.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-xs font-medium text-muted-foreground bg-muted/50">
                    Suggestions
                  </div>
                  {displayedSuggestions.map((suggestion, index) => (
                    <button
                      key={`suggestion-${index}`}
                      type="button"
                      className={cn(
                        "w-full px-3 py-2 text-left text-sm hover:bg-muted/50 transition-colors flex items-center gap-2",
                        selectedIndex === index && "bg-muted"
                      )}
                      onClick={() => handleItemSelect(suggestion)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <Search className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Separator */}
              {displayedSuggestions.length > 0 && displayedHistory.length > 0 && (
                <Separator />
              )}

              {/* Search History */}
              {displayedHistory.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-xs font-medium text-muted-foreground bg-muted/50 flex items-center justify-between">
                    <span>Recent Searches</span>
                    {onClearHistory && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onClearHistory();
                        }}
                        className="h-auto p-0 text-xs hover:text-foreground"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  {displayedHistory.map((historyItem, index) => {
                    const actualIndex = displayedSuggestions.length + index;
                    return (
                      <button
                        key={`history-${index}`}
                        type="button"
                        className={cn(
                          "w-full px-3 py-2 text-left text-sm hover:bg-muted/50 transition-colors flex items-center gap-2",
                          selectedIndex === actualIndex && "bg-muted"
                        )}
                        onClick={() => handleItemSelect(historyItem)}
                        onMouseEnter={() => setSelectedIndex(actualIndex)}
                      >
                        <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{historyItem}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* No suggestions message */}
              {displayedSuggestions.length === 0 && displayedHistory.length === 0 && value.length > 0 && (
                <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                  No suggestions found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}