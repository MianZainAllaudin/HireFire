import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';

export const LocationSearch = ({ onLocationSelect }: { onLocationSelect: (location: any) => void }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Add proper headers for Nominatim
  const searchOptions = {
    headers: {
      'User-Agent': 'YourAppName/1.0 (your@email.com)',
      'Accept-Language': 'en'
    }
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Auto-search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length >= 3) {
      searchLocations(debouncedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  const searchLocations = async (searchText: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText + ', Pakistan')}`,
        searchOptions
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid content type');
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Feather name="search" size={20} color="#FF4D4D" style={styles.searchIcon} />
        <TextInput
          style={[styles.input, { color: '#FF4D4D' }]}
          placeholder="Search location (e.g., Lahore)"
          placeholderTextColor="#FF9999" // Lighter red for placeholder
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
        {loading && <ActivityIndicator size="small" color="#FF4D4D" />}
      </View>

      {results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.place_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => onLocationSelect(item)}
            >
              <ThemedText style={styles.resultText}>{item.display_name}</ThemedText>
            </TouchableOpacity>
          )}
          style={styles.resultsList}
          keyboardShouldPersistTaps="always"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F0F0',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#FF4D4D',
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  resultsList: {
    maxHeight: 200,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginTop: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#FF4D4D',
  },
  resultItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FFCCCC',
  },
  resultText: {
    fontSize: 14,
    color: '#FF4D4D',
    fontWeight: '500',
  },
  selectedLocationContainer: {
    backgroundColor: '#FFF0F0',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF4D4D',
  },
  selectedLocationText: {
    fontSize: 14,
    color: '#FF4D4D',
    flex: 1,
    marginRight: 8,
    fontWeight: '600',
  },
});