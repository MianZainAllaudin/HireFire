import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,  
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';
import usersData from '@/assets/data/exampleUsers.json';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router/build/exports';
import { ThemedText } from '@/components/ThemedText';
import { useAppContext } from '@/scripts/AppContext';

// Define TypeScript interface for user data
interface User {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  image: string;
  fee: string;
  email: string;
  phone: string;
  address: string;
  // You can add any additional fields that might be present in your JSON
}

export default function CustomerPg2CScreen() {
  // Calculate satisfaction percentage from reviews count (just for demo purposes)
  const calculateSatisfaction = (reviews: number): number => {
    // Simple algorithm to create a satisfaction percentage from reviews
    // Higher review counts tend to have higher satisfaction
    const base = 80; // Base satisfaction percentage
    const bonus = Math.min(20, Math.floor(reviews / 50)); // Bonus based on review count, max 20%
    return base + bonus;
  };
  const {user, setUser} = useAppContext();
  const {
    result
  } = useLocalSearchParams<{
    result: User[]
  } | any>();
  const workerList = JSON.parse(result);
  

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= rating;
      stars.push(
        <FontAwesome
          key={i}
          name={isFilled ? 'star' : 'star-o'}
          size={16}
          color={isFilled ? '#FFD700' : '#D3D3D3'}
          style={styles.starIcon}
        />
      );
    }
    return <View style={styles.starRow}>{stars}</View>;
  };

  const handleChatButtonPress = (workerName: any, workerId: any) => {
    const params = {
      clientName: user?.name,
      clientId: user?.userId,
      workerName,
      workerId,
      role: 'client'
    };

    router.push({
      pathname: "/chatPg",
      params,
    });
  }

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Section Title */}
        <View style={styles.sectionTitleContainer}>
          <ThemedText style={styles.sectionTitle}>Matches Found</ThemedText>
        </View>

        {/* Worker Cards - Dynamically rendered based on usersData length */}
        {(workerList as User[]).map((user: any) => (
          <View key={user.userId} style={styles.card}>
            <View style={styles.cardContent}>
              {/* Left side - Avatar */}
              <View style={styles.avatarContainer}>
                <Image source={{ uri: user.image }} style={styles.avatar} />
              </View>

              {/* Right side - Info */}
              <View style={styles.infoContainer}>
                <Text style={styles.name}>{user.name}</Text>
                {renderStars(user.rating)}

                {/* Stats row */}
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>10 Years</Text>
                    <Text style={styles.statLabel}>experience</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{calculateSatisfaction(user.reviews)}%</Text>
                    <Text style={styles.statLabel}>satisfied customers</Text>
                  </View>
                </View>

                {/* Action buttons */}
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.chatButton} onPress={() => handleChatButtonPress(user.name, user.userId)}>
                    <FontAwesome name="comment-o" size={20} color="#333" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.bookButton}
                    onPress={() => router.push({ pathname: '/customerPg3', params: {
                      userId: user.userId,
                      paramUser: JSON.stringify(user)
                    } })}
                  >
                    <Text style={styles.bookButtonText}>Hire Details</Text>
                    <Feather name="arrow-right" size={18} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  leftContainer: {
    width: 70,
    paddingTop: 20,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  
  centerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  rightContainer: {
    width: 70,
    paddingTop: 20,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  logoImage: {
    width: 120,
    height: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 38,
    backgroundColor: '#1A0D0E',
    position: 'relative',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileIcon: {
    padding: 5,
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  scrollContainer: {
    padding: 16,
  },
  sectionTitleContainer: {
    backgroundColor: '#F5F0F0',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  sectionTitle: {
    marginTop: 8,
    fontSize: 21,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  card: {
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  avatarContainer: {
    position: 'absolute',
    left: 16,
    top: 15,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F5F5DC',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: 60,
    height: 60,
  },
  infoContainer: {
    marginLeft: 85,
    paddingRight: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingBottom: 10,
  },
  starRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  starIcon: {
    marginRight: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: '#DDD',
    marginHorizontal: 10,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 5,
    position: 'relative',
  },
  chatButton: {
    position: 'absolute',
    left: -80, // Shift to the left
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  bookButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E74C3C',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginLeft: 12,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginRight: 5,
  },
});