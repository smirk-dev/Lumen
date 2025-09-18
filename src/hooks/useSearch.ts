import { useState, useMemo, useCallback } from 'react';
import { useDebounce } from './useDebounce';

export interface SearchOptions {
  debounceMs?: number;
  caseSensitive?: boolean;
  fuzzyThreshold?: number;
  searchFields?: string[];
}

export interface SearchResult<T> {
  items: T[];
  totalCount: number;
  hasFilters: boolean;
  searchTerm: string;
}

/**
 * Enhanced search hook with fuzzy matching, debouncing, and multi-field search
 */
export function useSearch<T extends Record<string, any>>(
  items: T[],
  options: SearchOptions = {}
) {
  const {
    debounceMs = 300,
    caseSensitive = false,
    fuzzyThreshold = 0.6,
    searchFields = ['title', 'name', 'description']
  } = options;

  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  // Calculate Levenshtein distance for fuzzy matching
  const calculateDistance = useCallback((str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    return matrix[str2.length][str1.length];
  }, []);

  // Fuzzy match function
  const fuzzyMatch = useCallback((searchTerm: string, targetText: string): boolean => {
    if (!searchTerm || !targetText) return false;
    
    const search = caseSensitive ? searchTerm : searchTerm.toLowerCase();
    const target = caseSensitive ? targetText : targetText.toLowerCase();
    
    // Exact match or contains
    if (target.includes(search)) return true;
    
    // Fuzzy matching for longer search terms
    if (search.length >= 3) {
      const distance = calculateDistance(search, target);
      const similarity = 1 - (distance / Math.max(search.length, target.length));
      return similarity >= fuzzyThreshold;
    }
    
    return false;
  }, [caseSensitive, fuzzyThreshold, calculateDistance]);

  // Generate search suggestions based on existing data
  const searchSuggestions = useMemo(() => {
    if (!debouncedSearchTerm || debouncedSearchTerm.length < 2) return [];
    
    const suggestions = new Set<string>();
    const searchLower = debouncedSearchTerm.toLowerCase();
    
    items.forEach(item => {
      searchFields.forEach(field => {
        const value = item[field];
        if (typeof value === 'string') {
          const valueLower = value.toLowerCase();
          
          // Add exact matches
          if (valueLower.includes(searchLower)) {
            suggestions.add(value);
          }
          
          // Add word matches
          const words = value.split(/\s+/);
          words.forEach(word => {
            if (word.toLowerCase().includes(searchLower)) {
              suggestions.add(word);
            }
          });
        }
      });
    });
    
    return Array.from(suggestions).slice(0, 8);
  }, [items, debouncedSearchTerm, searchFields]);

  // Filter items based on search term
  const filteredItems = useMemo(() => {
    if (!debouncedSearchTerm) return items;
    
    return items.filter(item => {
      return searchFields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return fuzzyMatch(debouncedSearchTerm, value);
        }
        return false;
      });
    });
  }, [items, debouncedSearchTerm, searchFields, fuzzyMatch]);

  // Add search to history
  const addToHistory = useCallback((term: string) => {
    if (!term.trim() || searchHistory.includes(term)) return;
    
    setSearchHistory(prev => [term, ...prev.slice(0, 9)]); // Keep last 10
  }, [searchHistory]);

  // Clear search history
  const clearHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  // Handle search term change
  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      addToHistory(term.trim());
    }
  }, [addToHistory]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  return {
    searchTerm,
    debouncedSearchTerm,
    setSearchTerm: handleSearchChange,
    clearSearch,
    filteredItems,
    searchSuggestions,
    searchHistory,
    clearHistory,
    hasActiveSearch: !!debouncedSearchTerm
  };
}