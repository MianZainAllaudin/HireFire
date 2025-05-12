//potato
import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation } from '@react-navigation/native';
import React from 'react';

export default function AvailableAppointmentsScreen() {
  const navigation = useNavigation();

  const [appointments, setAppointments] = useState([
    { id: '1', name: 'John Doe', service: 'Plumbing', time: '2:00 PM, 25th April' },
    { id: '2', name: 'Jane Smith', service: 'Electrician', time: '4:00 PM, 26th April' },
    { id: '3', name: 'Mike Johnson', service: 'Cleaning', time: '11:00 AM, 27th April' },
  ]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleAccept = (id: string) => {
    console.log(`Accepted appointment with id: ${id}`);
    // You can update the list here to remove or mark the appointment as accepted
  };

  const handleReject = (id: string) => {
    console.log(`Rejected appointment with id: ${id}`);
    // You can update the list here to remove or mark the appointment as rejected
  };

  return (
    <ThemedView style={styles.container}>
      
      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Available Appointments</Text>

        {appointments.map((appointment) => (
          <View key={appointment.id} style={styles.appointmentCard}>
            <View style={styles.appointmentInfo}>
              <Feather name="user" size={24} color="#1A0D0E" style={{ marginRight: 10 }} />
              <View>
                <Text style={styles.appointmentName}>{appointment.name}</Text>
                <Text style={styles.appointmentDetails}>{appointment.service}</Text>
                <Text style={styles.appointmentDetails}>{appointment.time}</Text>
              </View>
            </View>

            {/* Accept and Reject Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.actionButton, styles.acceptButton]}
                onPress={() => handleAccept(appointment.id)}
              >
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => handleReject(appointment.id)}
              >
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </ThemedView>
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
    paddingHorizontal: 16,
    paddingVertical: 36, // made the header shorter
    backgroundColor: '#1A0D0E',
    justifyContent: 'space-between',
  },
  headerButton: {
    width: 40,
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  logo: {
    width: 120,
    height: 60,
  },
  content: {
    flexGrow: 1,
    backgroundColor: '#F5F0F0',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  appointmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12, // Space before buttons
  },
  appointmentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  appointmentDetails: {
    fontSize: 14,
    color: '#666666',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  acceptButton: {
    backgroundColor: '#4CAF50', // Green
  },
  rejectButton: {
    backgroundColor: '#F44336', // Red
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
