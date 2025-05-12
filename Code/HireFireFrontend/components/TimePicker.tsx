import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

type TimePickerProps = {
  onTimeChange?: (hours: number, minutes: number) => void;
  initialHours?: number;
  initialMinutes?: number;
};

export const TimePicker: React.FC<TimePickerProps> = ({
  onTimeChange,
  initialHours = new Date().getHours(),
  initialMinutes = new Date().getMinutes(),
}) => {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempHours, setTempHours] = useState(initialHours);
  const [tempMinutes, setTempMinutes] = useState(initialMinutes);

  // Constants for time picker
  const ITEM_HEIGHT = 50;
  const VISIBLE_ITEMS = 5;
  const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  // Refs for the scroll views
  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);

  // Format time for display
  const formatTime = (hours: number, minutes: number) => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Initialize scroll positions
useEffect(() => {
  if (showTimePicker && hourScrollRef.current && minuteScrollRef.current) {
    // Use setTimeout to ensure the scroll happens after the modal is fully rendered
    setTimeout(() => {
      hourScrollRef.current?.scrollTo({
        y: tempHours * ITEM_HEIGHT,
        animated: false,
      });
      minuteScrollRef.current?.scrollTo({
        y: tempMinutes * ITEM_HEIGHT,
        animated: false,
      });
    }, 50);
  }
}, [showTimePicker]);

  useEffect(() => {
    setTempHours(initialHours)
    setTempMinutes(initialMinutes)
  }, [initialHours, initialMinutes])

  // Handle time selection
  const handleTimeSelect = () => {
    setShowTimePicker(false);
    if (onTimeChange) {
      onTimeChange(tempHours, tempMinutes);
    }
  };

  const handleHourScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const index = Math.min(23, Math.max(0, Math.round(y / ITEM_HEIGHT)));
    setTempHours(index);
  };

  const handleMinuteScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const index = Math.min(59, Math.max(0, Math.round(y / ITEM_HEIGHT)));
    setTempMinutes(index);
  };

  const snapToHour = (index: number) => {
    const safeIndex = Math.min(23, Math.max(0, index));
    setTempHours(safeIndex);
    hourScrollRef.current?.scrollTo({
      y: safeIndex * ITEM_HEIGHT,
      animated: true,
    });
  };
  
  const snapToMinute = (index: number) => {
    const safeIndex = Math.min(59, Math.max(0, index));
    setTempMinutes(safeIndex);
    minuteScrollRef.current?.scrollTo({
      y: safeIndex * ITEM_HEIGHT,
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <Feather name="clock" size={24} color="#888" style={styles.icon} />
        
        <TouchableOpacity 
          style={styles.timeInputContainer}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.timeInputText}>
            {formatTime(tempHours, tempMinutes)}
          </Text>
        </TouchableOpacity>
      </View>
      
      <Modal
        visible={showTimePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <TouchableOpacity 
          style={styles.timeModalOverlay}
          activeOpacity={1}
          onPress={() => setShowTimePicker(false)}
        >
          <View style={styles.timePickerContainer}>
            <View style={styles.timePickerHeader}>
              <Text style={styles.timePickerTitle}>Select Time</Text>
            </View>
            
            <View style={[styles.pickerContainer, { height: PICKER_HEIGHT }]}>
              <View style={styles.pickerColumn}>
                <ScrollView
                  ref={hourScrollRef}
                  showsVerticalScrollIndicator={false}
                  onScroll={handleHourScroll}
                  scrollEventThrottle={16}
                  snapToInterval={ITEM_HEIGHT}
                  contentContainerStyle={styles.pickerContent}
                  onMomentumScrollEnd={(e) => {
                    const y = e.nativeEvent.contentOffset.y;
                    const index = Math.round(y / ITEM_HEIGHT);
                    snapToHour(index);
                  }}
                  decelerationRate="fast"
                  bounces={false}
                  style={{ height: PICKER_HEIGHT }}
                >
                  {hours.map((hour) => (
                    <TouchableOpacity
                      key={`hour-${hour}`}
                      style={[styles.pickerItem, { height: ITEM_HEIGHT }]}
                      onPress={() => snapToHour(hour)}
                    >
                      <Text style={[
                        styles.pickerItemText,
                        hour === tempHours ? styles.selectedPickerItemText : {}
                      ]}>
                        {hour.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <View style={styles.pickerHighlight} />
              </View>
              
              <Text style={styles.timeSeparator}>:</Text>
              
              <View style={styles.pickerColumn}>
                <ScrollView
                  ref={minuteScrollRef}
                  showsVerticalScrollIndicator={false}
                  onScroll={handleMinuteScroll}
                  scrollEventThrottle={16}
                  snapToInterval={ITEM_HEIGHT}
                  contentContainerStyle={styles.pickerContent}
                  onMomentumScrollEnd={(e) => {
                    const y = e.nativeEvent.contentOffset.y;
                    const index = Math.round(y / ITEM_HEIGHT);
                    snapToMinute(index);
                  }}
                  decelerationRate="fast"
                  bounces={false}
                  style={{ height: PICKER_HEIGHT }}
                >
                  {minutes.map((minute) => (
                    <TouchableOpacity
                      key={`minute-${minute}`}
                      style={[styles.pickerItem, { height: ITEM_HEIGHT }]}
                      onPress={() => snapToMinute(minute)}
                    >
                      <Text style={[
                        styles.pickerItemText,
                        minute === tempMinutes ? styles.selectedPickerItemText : {}
                      ]}>
                        {minute.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <View style={styles.pickerHighlight} />
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.timePickerButton}
              onPress={handleTimeSelect}
            >
              <Text style={styles.timePickerButtonText}>Set Time</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
    marginLeft: 20,
    color: '#FF4D4D',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInputContainer: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 6,
    width: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeInputText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
  timeModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timePickerContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: 300,
  },
  timePickerHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timePickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  pickerColumn: {
    flex: 1,
    height: '100%',
    position: 'relative',
  },
  pickerContent: {
    paddingTop: 80,
    paddingBottom: 80,
  },
  pickerItem: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    marginVertical: 0,
  },
  pickerItemText: {
    fontSize: 20,
    color: '#666',
    marginTop: 40,
    height: 25, // Add fixed width
    textAlign: 'center', // Center the text
  },
  pickerHighlight: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 40,
    marginTop: -20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#FF4D4D',
    backgroundColor: 'rgba(255, 77, 77, 0.1)',
  },
  timeSeparator: {
    fontSize: 24,
    color: '#333',
    marginHorizontal: 5,
  },
  timePickerButton: {
    backgroundColor: '#FF4D4D',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  timePickerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedPickerItemText: {
    color: '#FF4D4D',
    fontWeight: 'bold',
    fontSize: 24,
    width: 40, // Add fixed width
    textAlign: 'center', // Center the text
  },
});

export default TimePicker;