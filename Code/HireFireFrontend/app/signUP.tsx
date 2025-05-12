import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Switch, ScrollView } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo
import { BASE_URL } from '@/config';
import TimePicker from '@/components/TimePicker';
import { TimeRange } from '@/scripts/timeRange';

const categories = [
  "Electrician", "Mechanic", "Plumber", "Carpenter", "Painter", "Labourer",
  "Janitor", "Gardener", "Cook", "Mason", "Baby Sitter", "Gas Fitter"
];

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isWorker, setIsWorker] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [category, setCategory] = useState('');
  const [experience, setExperience] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [availableStart, setAvailableStart] = useState({hours: 9, minutes: 0});
  const [availableEnd, setAvailableEnd] = useState({hours: 17, minutes: 0});
  // States to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    // Reset messages
    setErrorMessage('');
    setSuccessMessage('');

    // Validate inputs
    if (!name || !email || !password || !confirmPassword || (isWorker && (!category || !hourlyRate || !experience))) {
      setErrorMessage('Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    //Use different API endpoints based on whether signing up as worker or user
    const apiUrl = isWorker
        ? BASE_URL + 'api/auth/worker/signup'
        : BASE_URL + 'api/auth/signup';

    let userData: any = {
      name: name,
      email: email.toLowerCase(),
      password: password,
      isWorker,
    };

    if (isWorker)
      userData = {
        ...userData,
        category,
        experience,
        hourlyRate,
        availability: TimeRange.toString(availableStart, availableEnd)
      }


    try {
      const response = await axios.post(apiUrl, userData);
      const accountType = isWorker ? 'Worker' : 'User';
      setSuccessMessage(response.data.message || `${accountType} account created successfully!`);

      Alert.alert(
          'Success',
          response.data.message || `${accountType} account created successfully!`,
          [
            {
              text: 'Login Now',
              onPress: () => router.push('/login')
            },
            {
              text: 'OK'
            }
          ]
      );

      // Clear form after successful signup
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setIsWorker(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 409) {
          const accountType = isWorker ? 'worker' : 'user';
          setErrorMessage(`This email is already registered as a ${accountType}`);

          Alert.alert(
              'Email Already Exists',
              `This email is already registered as a ${accountType}. Would you like to login instead?`,
              [
                { text: 'Cancel' },
                {
                  text: 'Go to Login',
                  onPress: () => router.push(isWorker ? ('/worker/login' as any) : '/login')
                }
              ]
          );
        } else {
          setErrorMessage(error.response.data.message || 'Registration failed');
          Alert.alert('Error', error.response.data.message || 'Registration failed');
        }
      } else if (error instanceof Error) {
        setErrorMessage('An unexpected error occurred: ' + error.message);
        Alert.alert('Error', 'An unexpected error occurred: ' + error.message);
      } else {
        setErrorMessage('Failed to connect to the server');
        Alert.alert('Error', 'Failed to connect to the server');
      }
    }
  };

  const handleTimeChange = (hours: any, minutes: any, setFunction: any) => {
    setFunction({hours, minutes});
  }

  // Handler to navigate to appropriate login page
  const goToLogin = () => {
    router.back();
    // router.push(isWorker ? ('/worker/login' as any) : '/login');
  };

  // Toggle password visibility handlers
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
        <Text style={styles.title}>Sign Up</Text>

        {/* Display error message if there is one */}
        {errorMessage ? (
            <View style={styles.messageContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
        ) : null}

        {/* Display success message if there is one */}
        {successMessage ? (
            <View style={styles.messageContainer}>
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
        ) : null}

        <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="grey"
            value={name}
            onChangeText={setName}
        />

        <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="grey"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
        />

        {/* Password input with show/hide toggle */}
        <View style={styles.passwordContainer}>
          <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="grey"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
          />
          <TouchableOpacity 
              style={styles.eyeIcon} 
              onPress={togglePasswordVisibility}
          >
            <Ionicons 
                name={showPassword ? "eye-off" : "eye"} 
                size={24} 
                color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password input with show/hide toggle */}
        <View style={styles.passwordContainer}>
          <TextInput
              style={styles.passwordInput}
              placeholder="Confirm Password"
              placeholderTextColor="grey"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity 
              style={styles.eyeIcon} 
              onPress={toggleConfirmPasswordVisibility}
          >
            <Ionicons 
                name={showConfirmPassword ? "eye-off" : "eye"} 
                size={24} 
                color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Worker account toggle */}
        <View style={styles.switchContainer}>
          <Text>Sign up as a Worker</Text>
          <Switch
              value={isWorker}
              onValueChange={setIsWorker}
              trackColor={{ false: "#767577", true: "#4caf50" }}
              thumbColor={isWorker ? "#8bc34a" : "#f4f3f4"}
          />
        </View>

        {isWorker && <View style={styles.workerOnly}>
          <Text>Category</Text>

          <Dropdown
            mode='modal'
            style={styles.workerCategoryDropdown}
            placeholderStyle={styles.workerCategoryPlaceholder}
            selectedTextStyle={styles.workerCategorySelectedText}
            data={categories.map(a => {return {label: a, value: a}})}
            maxHeight={200}
            labelField="label"
            valueField="value"
            placeholder="Select item"
            value={category}
            onChange={item => {
              setCategory(item.value);
            }}
          />

          <View style={styles.splitContainer}>
            <View style={styles.fullWidth}>
              <Text>Experience (years)</Text>
              <TextInput
                style={{...styles.input}}
                keyboardType="numeric"
                value={experience}
                onChangeText={setExperience}
                placeholder="e.g. 3"
                placeholderTextColor="grey"
                returnKeyType='done'
              />
            </View>
            <View style={styles.fullWidth}>
              <Text>Hourly Rate (Rs.)</Text>
              <TextInput
                style={{...styles.input}}
                keyboardType="numeric"
                value={hourlyRate}
                onChangeText={setHourlyRate}
                placeholder="e.g. Rs. 250"
                placeholderTextColor="grey"
                returnKeyType='done'
              />
            </View>
          </View>

          <View style={styles.splitContainer}>
            <View style={styles.fullWidth}>
              <Text>From:</Text>
              <TimePicker 
                initialHours={availableStart.hours}
                initialMinutes={availableStart.minutes}
                onTimeChange={(hours, minutes) => handleTimeChange(hours, minutes, setAvailableStart)}
              />
            </View>
            <View style={styles.fullWidth}>
              <Text>To:</Text>
              <TimePicker 
                initialHours={availableEnd.hours}
                initialMinutes={availableEnd.minutes}
                onTimeChange={(hours, minutes) => {
                  console.log({hours, minutes}, availableStart);
                  console.log((minutes + (hours * 60)), (availableStart.minutes + (availableStart.hours * 60)), (availableEnd.minutes + (availableEnd.hours * 60)));
                  if ((minutes + (hours * 60)) > (availableStart.minutes + (availableStart.hours * 60)))
                    handleTimeChange(hours, minutes, setAvailableEnd)
                  else
                    handleTimeChange(availableStart.hours, availableStart.minutes, setAvailableEnd);
                }}
              />
            </View>
          </View>

          {/* <TouchableOpacity style={styles.button} onPress={() => {
            Alert.alert(`${availableStart.hours}:${availableStart.minutes}\n${availableEnd.hours}:${availableEnd.minutes}`);
          }}><Text>pressme</Text></TouchableOpacity> */}
        </View>}

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Login redirect section */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={goToLogin}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: '#f9f9f9',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    // marginVertical: 100,
  },
  splitContainer: {
    display: "flex",
    gap: 5,
    flexDirection: "row",
    alignSelf: "stretch"
  },
  fullWidth: {
    width: "50%"
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  messageContainer: {
    width: '100%',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  errorText: {
    color: '#d9534f',
    textAlign: 'center',
    fontWeight: '500',
  },
  successText: {
    color: '#5cb85c',
    textAlign: 'center',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
  },
  eyeIcon: {
    padding: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#E45959',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  loginText: {
    color: '#333',
  },
  loginLink: {
    color: '#E45959',
    fontWeight: 'bold',
  },
  workerOnly: {
    marginVertical: 12,
    width: "100%",
  },
  workerCategoryDropdown: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  workerCategoryPlaceholder: {
    color: '#999',
    fontSize: 16,
  },
  workerCategorySelectedText: {
    color: '#333',
    fontSize: 16,
  },
});

export default Signup;