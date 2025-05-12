// components/LoadingModal.js
import React from 'react';
import { Modal, View, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingModal = () => (
  <Modal
    transparent
    animationType="fade"
    statusBarTranslucent
  >
    <View style={styles.container}>
      <View style={styles.loaderBox}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderBox: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    opacity: 0.8,
  },
});

export default LoadingModal;
