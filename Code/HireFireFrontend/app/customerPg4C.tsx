import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import LottieView from 'lottie-react-native';
import { Audio } from 'expo-av';
import { router, useLocalSearchParams } from 'expo-router/build/exports';
import { Text } from 'react-native';

import exampleUsers from '@/assets/data/exampleConsultants.json'; // Adjust path if needed

export default function CustomerPgScreen() {
const { userId } = useLocalSearchParams();

  const numericId = Number(userId); // Convert route param to number
  const matchedUser = exampleUsers.find((user) => user.id === numericId);

  useEffect(() => {
    console.log('Route param id:', userId); // Debug: check what ID is passed
    console.log('Matched user:', matchedUser?.name); // Debug: is user found?

    const playSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/sounds/success.mp3')
      );
      await sound.playAsync();
    };

    playSound();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        <View style={styles.confirmationContainer}>
          <ThemedText style={styles.confirmationText}>
            Request sent to {matchedUser?.name ?? 'User'}
          </ThemedText>

          <LottieView
            source={require('@/assets/animations/tick.json')}
            autoPlay
            loop={false}
            style={styles.lottie}
          />

          <TouchableOpacity style={styles.button} onPress={() => router.push({ pathname: '/homePageCustomer', params:{} })}>
            <Text style={styles.buttonText}>Home</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D1D1D',
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
  contentContainer: {
    flex: 1,
    backgroundColor: '#F5F0F0',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
  },
  confirmationContainer: {
    marginTop: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  confirmationText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A0D0E',
    marginBottom: 24,
  },
  lottie: {
    width: 160,
    height: 160,
  },
  button: {
    marginTop: 16,
    paddingVertical: 10,
    width: 100,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#FF4D4D',
    alignItems: 'center',
    borderColor: '#FF4D4D',
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});
