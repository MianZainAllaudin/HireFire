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
  Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

type DateTimePickerProps = {
  onDateChange?: (date: Date) => void;
  initialDate?: Date;
};

type ViewMode = 'days' | 'months' | 'years';

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  onDateChange,
  initialDate = new Date()
}) => {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [displayDate, setDisplayDate] = useState(initialDate);
  const [showCalendar, setShowCalendar] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('days');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempHours, setTempHours] = useState(initialDate.getHours());
  const [tempMinutes, setTempMinutes] = useState(initialDate.getMinutes());

  // Constants for time picker
  const ITEM_HEIGHT = 40;
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  // Format date for display
  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = MONTHS[date.getMonth()].substring(0, 3);
    return `${day} ${month}`;
  };

  // Format time for display
  const formatTime = (hours: number, minutes: number) => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get days of the current month to display
  const getDaysArray = () => {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();
    
    const daysArray = [];
    
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }
    
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - (firstDay + daysInMonth);
    for (let i = 0; i < remainingCells; i++) {
      daysArray.push(null);
    }
    
    return daysArray;
  };

  // Handle selecting a day
  const handleDaySelect = (day: number) => {
    if (!day) return;
    
    const newDate = new Date(displayDate);
    newDate.setDate(day);
    newDate.setHours(tempHours);
    newDate.setMinutes(tempMinutes);
    
    setSelectedDate(newDate);
    
    if (onDateChange) {
      onDateChange(newDate);
    }
    
    setShowCalendar(false);
  };

  // Handle changing month
  const changeMonth = (delta: number) => {
    const newDate = new Date(displayDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setDisplayDate(newDate);
  };

  // Handle selecting a month
  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(displayDate);
    newDate.setMonth(monthIndex);
    setDisplayDate(newDate);
    setViewMode('days');
  };

  // Handle selecting a year
  const handleYearSelect = (year: number) => {
    const newDate = new Date(displayDate);
    newDate.setFullYear(year);
    setDisplayDate(newDate);
    setViewMode('months');
  };

  // Generate years for year picker
  const getYearsArray = () => {
    const currentYear = displayDate.getFullYear();
    const startYear = currentYear - 7;
    const years = [];
    
    for (let i = 0; i < 15; i++) {
      years.push(startYear + i);
    }
    
    return years;
  };

  // Handle time selection
  const handleTimeSelect = () => {
    const newDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      tempHours,
      tempMinutes
    );
    
    setSelectedDate(newDate);
    setShowTimePicker(false);
    
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  const handleHourScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const index = Math.min(23, Math.max(0, Math.floor(y / ITEM_HEIGHT + 0.5)));
    setTempHours(index);
  };
  
  const handleMinuteScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const index = Math.min(59, Math.max(0, Math.floor(y / ITEM_HEIGHT + 0.5)));
    setTempMinutes(index);
  };

  const renderDaysView = () => {
    const days = getDaysArray();
    
    return (
      <>
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={() => changeMonth(-1)}>
            <Feather name="chevron-left" size={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => setViewMode('months')}>
            <Text style={styles.monthYearText}>
              {MONTHS[displayDate.getMonth()]} {displayDate.getFullYear()}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => changeMonth(1)}>
            <Feather name="chevron-right" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.weekdaysRow}>
          {WEEKDAYS.map((day, index) => (
            <Text key={index} style={styles.weekdayText}>{day}</Text>
          ))}
        </View>
        
        <View style={styles.daysGrid}>
          {days.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                day === selectedDate.getDate() && 
                displayDate.getMonth() === selectedDate.getMonth() && 
                displayDate.getFullYear() === selectedDate.getFullYear() 
                  ? styles.selectedDayCell 
                  : {}
              ]}
              onPress={() => day && handleDaySelect(day)}
              disabled={!day}
            >
              {day ? <Text style={[
                styles.dayText,
                day === selectedDate.getDate() && 
                displayDate.getMonth() === selectedDate.getMonth() && 
                displayDate.getFullYear() === selectedDate.getFullYear() 
                  ? styles.selectedDayText 
                  : {}
              ]}>{day}</Text> : null}
            </TouchableOpacity>
          ))}
        </View>
      </>
    );
  };

  const renderMonthsView = () => {
    return (
      <>
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={() => setViewMode('years')}>
            <Text style={styles.monthYearText}>{displayDate.getFullYear()}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.monthsGrid}>
          {MONTHS.map((month, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.monthCell,
                index === selectedDate.getMonth() && 
                displayDate.getFullYear() === selectedDate.getFullYear() 
                  ? styles.selectedMonthCell 
                  : {}
              ]}
              onPress={() => handleMonthSelect(index)}
            >
              <Text style={styles.monthText}>{month.substring(0, 3)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </>
    );
  };

  const renderYearsView = () => {
    const years = getYearsArray();
    
    return (
      <>
        <View style={styles.calendarHeader}>
          <Text style={styles.monthYearText}>
            {years[0]} - {years[years.length - 1]}
          </Text>
        </View>
        
        <View style={styles.yearsGrid}>
          {years.map((year, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.yearCell,
                year === selectedDate.getFullYear() 
                  ? styles.selectedYearCell 
                  : {}
              ]}
              onPress={() => handleYearSelect(year)}
            >
              <Text style={styles.yearText}>{year}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </>
    );
  };

  const renderTimePicker = () => {
    const ITEM_HEIGHT = 50; // Increased height for better touch area
    const VISIBLE_ITEMS = 5; // Number of items visible in the picker
    const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
  
    // Refs for the scroll views
    const hourScrollRef = useRef<ScrollView>(null);
    const minuteScrollRef = useRef<ScrollView>(null);
  
    // Initialize scroll positions
    useEffect(() => {
      if (hourScrollRef.current) {
        hourScrollRef.current.scrollTo({
          y: tempHours * ITEM_HEIGHT,
          animated: false,
        });
      }
      if (minuteScrollRef.current) {
        minuteScrollRef.current.scrollTo({
          y: tempMinutes * ITEM_HEIGHT,
          animated: false,
        });
      }
    }, [showTimePicker]);
  
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
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <Feather name="clock" size={24} color="#888" style={styles.icon} />
        
        <TouchableOpacity 
          style={styles.dateInput}
          onPress={() => setShowCalendar(true)}
        >
          <Text style={styles.dateInputText}>{formatDate(selectedDate)}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.timeInputContainer}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.timeInputText}>
            {formatTime(selectedDate.getHours(), selectedDate.getMinutes())}
          </Text>
        </TouchableOpacity>
      </View>
      
      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCalendar(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCalendar(false)}
        >
          <TouchableOpacity 
            activeOpacity={1}
            style={styles.calendarContainer}
            onPress={e => e.stopPropagation()}
          >
            {viewMode === 'days' && renderDaysView()}
            {viewMode === 'months' && renderMonthsView()}
            {viewMode === 'years' && renderYearsView()}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      
      {renderTimePicker()}
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
  dateInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 6,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateInputText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
  timeInputContainer: {
    backgroundColor: '#FFFFFF',
    marginLeft: 15,
    marginRight: 50,
    borderRadius: 6,
    width: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeInputText: {
    padding: 12,
    width: '100%',
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    backgroundColor: '#1A0D0E',
    borderRadius: 8,
    padding: 16,
    width: 300,
    maxHeight: 400,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  monthYearText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    width: '100%',
  },
  weekdayText: {
    color: '#BBB',
    width: '14.28%',
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'space-between',
  },
  dayCell: {
    width: '14.28%',
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  dayText: {
    color: 'white',
    textAlign: 'center',
  },
  selectedDayCell: {
    backgroundColor: '#FF4D4D',
    borderRadius: 18,
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  monthCell: {
    width: '30%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: '1.66%',
    borderRadius: 8,
  },
  monthText: {
    color: 'white',
    fontSize: 16,
  },
  selectedMonthCell: {
    backgroundColor: '#FF4D4D',
  },
  yearsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  yearCell: {
    width: '30%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: '1.66%',
    borderRadius: 8,
  },
  yearText: {
    color: 'white',
    fontSize: 16,
  },
  selectedYearCell: {
    backgroundColor: '#FF4D4D',
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
  pickerContainer: {//------------------------------------------------------
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
    justifyContent: 'center', // This stays
    alignItems: 'center', // This stays
    height: 40, // Add explicit height matching highlight
    marginVertical: 0, // Ensure no extra vertical spacing
  },
  pickerItemText: {
    fontSize: 20,
    color: '#666',
  },
  pickerHighlight: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 40, // Make sure this matches pickerItem height
    marginTop: -40, // Half of height (40/2)
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
  },
});