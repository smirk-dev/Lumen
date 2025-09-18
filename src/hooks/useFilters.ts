import { useState, useMemo, useCallback } from 'react';

export interface FilterConfig {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'boolean' | 'date' | 'range';
  options?: { value: string; label: string; count?: number }[];
  defaultValue?: any;
}

export interface ActiveFilter {
  id: string;
  label: string;
  value: any;
  displayValue: string;
}

export interface FilterState {
  [key: string]: any;
}

export interface SavedFilter {
  id: string;
  name: string;
  filters: FilterState;
  createdAt: Date;
}

/**
 * Enhanced filtering hook with support for multiple filter types, saved filters, and dynamic filter options
 */
export function useFilters<T extends Record<string, any>>(
  items: T[],
  filterConfigs: FilterConfig[],
  filterFunction?: (item: T, filters: FilterState) => boolean
) {
  const [filters, setFilters] = useState<FilterState>(() => {
    const initialFilters: FilterState = {};
    filterConfigs.forEach(config => {
      initialFilters[config.id] = config.defaultValue || getDefaultValue(config.type);
    });
    return initialFilters;
  });

  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);

  function getDefaultValue(type: string) {
    switch (type) {
      case 'select':
        return 'all';
      case 'multiselect':
        return [];
      case 'boolean':
        return false;
      case 'date':
        return null;
      case 'range':
        return { min: null, max: null };
      default:
        return null;
    }
  }

  // Update filter configs with dynamic counts
  const enhancedFilterConfigs = useMemo(() => {
    return filterConfigs.map(config => {
      if (config.type === 'select' || config.type === 'multiselect') {
        const options = config.options?.map(option => {
          if (option.value === 'all') return option;
          
          const count = items.filter(item => {
            const fieldValue = item[config.id];
            return fieldValue === option.value || 
                   (Array.isArray(fieldValue) && fieldValue.includes(option.value));
          }).length;
          
          return { ...option, count };
        });
        
        return { ...config, options };
      }
      return config;
    });
  }, [filterConfigs, items]);

  // Apply filters to items
  const filteredItems = useMemo(() => {
    if (filterFunction) {
      return items.filter(item => filterFunction(item, filters));
    }

    return items.filter(item => {
      return filterConfigs.every(config => {
        const filterValue = filters[config.id];
        const itemValue = item[config.id];

        switch (config.type) {
          case 'select':
            return filterValue === 'all' || itemValue === filterValue;
          
          case 'multiselect':
            if (!filterValue || filterValue.length === 0) return true;
            if (Array.isArray(itemValue)) {
              return filterValue.some((fv: string) => itemValue.includes(fv));
            }
            return filterValue.includes(itemValue);
          
          case 'boolean':
            return !filterValue || itemValue === filterValue;
          
          case 'date':
            if (!filterValue) return true;
            const itemDate = new Date(itemValue);
            const filterDate = new Date(filterValue);
            return itemDate.toDateString() === filterDate.toDateString();
          
          case 'range':
            if (!filterValue || (!filterValue.min && !filterValue.max)) return true;
            const numericValue = typeof itemValue === 'number' ? itemValue : parseFloat(itemValue);
            if (isNaN(numericValue)) return true;
            
            if (filterValue.min !== null && numericValue < filterValue.min) return false;
            if (filterValue.max !== null && numericValue > filterValue.max) return false;
            return true;
          
          default:
            return true;
        }
      });
    });
  }, [items, filters, filterConfigs, filterFunction]);

  // Get active filters for display
  const activeFilters = useMemo((): ActiveFilter[] => {
    return filterConfigs
      .map(config => {
        const value = filters[config.id];
        const isActive = getIsFilterActive(config, value);
        
        if (!isActive) return null;
        
        const displayValue = getDisplayValue(config, value);
        
        return {
          id: config.id,
          label: config.label,
          value,
          displayValue
        };
      })
      .filter(Boolean) as ActiveFilter[];
  }, [filters, filterConfigs]);

  function getIsFilterActive(config: FilterConfig, value: any): boolean {
    switch (config.type) {
      case 'select':
        return value !== 'all' && value !== '';
      case 'multiselect':
        return Array.isArray(value) && value.length > 0;
      case 'boolean':
        return Boolean(value);
      case 'date':
        return value !== null && value !== '';
      case 'range':
        return value && (value.min !== null || value.max !== null);
      default:
        return Boolean(value);
    }
  }

  function getDisplayValue(config: FilterConfig, value: any): string {
    switch (config.type) {
      case 'select':
        const option = config.options?.find(opt => opt.value === value);
        return option?.label || value;
      case 'multiselect':
        if (!Array.isArray(value) || value.length === 0) return '';
        if (value.length === 1) {
          const option = config.options?.find(opt => opt.value === value[0]);
          return option?.label || value[0];
        }
        return `${value.length} selected`;
      case 'boolean':
        return value ? 'Yes' : 'No';
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'range':
        if (value.min !== null && value.max !== null) {
          return `${value.min} - ${value.max}`;
        }
        if (value.min !== null) return `≥ ${value.min}`;
        if (value.max !== null) return `≤ ${value.max}`;
        return '';
      default:
        return String(value);
    }
  }

  // Update a specific filter
  const updateFilter = useCallback((filterId: string, value: any) => {
    setFilters(prev => ({ ...prev, [filterId]: value }));
  }, []);

  // Clear a specific filter
  const clearFilter = useCallback((filterId: string) => {
    const config = filterConfigs.find(c => c.id === filterId);
    if (config) {
      setFilters(prev => ({ 
        ...prev, 
        [filterId]: config.defaultValue || getDefaultValue(config.type) 
      }));
    }
  }, [filterConfigs]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    const clearedFilters: FilterState = {};
    filterConfigs.forEach(config => {
      clearedFilters[config.id] = config.defaultValue || getDefaultValue(config.type);
    });
    setFilters(clearedFilters);
  }, [filterConfigs]);

  // Save current filter state
  const saveCurrentFilters = useCallback((name: string) => {
    const savedFilter: SavedFilter = {
      id: `filter_${Date.now()}`,
      name,
      filters: { ...filters },
      createdAt: new Date()
    };
    setSavedFilters(prev => [savedFilter, ...prev]);
    return savedFilter.id;
  }, [filters]);

  // Load saved filter
  const loadSavedFilter = useCallback((filterId: string) => {
    const savedFilter = savedFilters.find(f => f.id === filterId);
    if (savedFilter) {
      setFilters(savedFilter.filters);
    }
  }, [savedFilters]);

  // Delete saved filter
  const deleteSavedFilter = useCallback((filterId: string) => {
    setSavedFilters(prev => prev.filter(f => f.id !== filterId));
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return activeFilters.length > 0;
  }, [activeFilters]);

  return {
    filters,
    filteredItems,
    activeFilters,
    hasActiveFilters,
    filterConfigs: enhancedFilterConfigs,
    savedFilters,
    updateFilter,
    clearFilter,
    clearAllFilters,
    saveCurrentFilters,
    loadSavedFilter,
    deleteSavedFilter
  };
}