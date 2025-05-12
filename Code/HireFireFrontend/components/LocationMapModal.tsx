import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { ThemedText } from './ThemedText';

export const LocationMapModal = ({
  visible,
  location,
  onClose,
}: {
  visible: boolean;
  location: any;
  onClose: () => void;
}) => {
  if (!location) return null;

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: parseFloat(location.lat),
            longitude: parseFloat(location.lon),
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: parseFloat(location.lat),
              longitude: parseFloat(location.lon),
            }}
            title={location.display_name}
          />
        </MapView>

        <View style={styles.footer}>
          <ThemedText style={styles.locationText}>
            {location.display_name}
          </ThemedText>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <ThemedText style={styles.closeButtonText}>Confirm Location</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 16,
    borderRadius: 8,
    elevation: 4,
  },
  locationText: {
    marginBottom: 12,
  },
  closeButton: {
    backgroundColor: '#FF4D4D',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});