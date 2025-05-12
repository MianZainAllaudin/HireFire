import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Switch, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo
import { BASE_URL } from '@/config';
import { useAppContext } from '@/scripts/AppContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isWorker, setIsWorker] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const router = useRouter();
  
  const { user, setUser } = useAppContext();

  const handleLogin = async () => {
    // Reset messages
    setErrorMessage('');
    setSuccessMessage('');
  
    // Validate inputs
    if (!email || !password) {
      setErrorMessage('Please fill all fields');
      return;
    }
  
    // Choose the appropriate API endpoint based on account type
    const apiUrl = isWorker 
      ? BASE_URL + 'api/auth/worker/login' 
      : BASE_URL + 'api/auth/login';
    
    const userData = {
      email: email.trim(),
      password: password,
    };
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setErrorMessage(data.message || 'Login failed');
        Alert.alert('Error', data.message || 'Login failed');
        return;
      }
  
      setSuccessMessage('Logged in successfully!');
      console.log(data);
      setUser({
        name: data.name,
        email: data.email,
        userId: data.userId,
        role: (isWorker) ? 'worker' : 'client'
      })
      
      // Navigate to appropriate page based on account type
      const destination: any = isWorker ? '/homePageWorker' : '/homePageCustomer';
      
      router.replace(destination);
  
      // Clear form after successful login
      setEmail('');
      setPassword('');
    } catch (error: any) {
      setErrorMessage('An unexpected error occurred');
      Alert.alert('Error', 'An unexpected error occurred: ' + error.message);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <View style={styles.centerContainer}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.logoText}>Welcome to Hire<Text style={styles.logoTextRed}>Fire</Text>!</Text>
        <Text>Login with your HireFire account to start.</Text>
      </View>

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

      {/* Worker account toggle */}
      <View style={styles.switchContainer}>
        <Text>Login as a Worker</Text>
        <Switch
          value={isWorker}
          onValueChange={setIsWorker}
          trackColor={{ false: "#767577", true: "#4caf50" }}
          thumbColor={isWorker ? "#8bc34a" : "#f4f3f4"}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Signup redirect section */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/signUP')}>
          <Text style={styles.signupLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  messageContainer: {
    width: '100%',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  errorText: {
    color: '#d9534f', // Red color for errors
    textAlign: 'center',
    fontWeight: '500',
  },
  successText: {
    color: '#5cb85c', // Green color for success
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
  signupContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signupText: {
    color: '#333',
  },
  signupLink: {
    color: '#E45959',
    fontWeight: 'bold',
  },
  centerContainer: {
    marginBottom: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    height: 80
  },
  logoText: {
    fontSize: 32,
    padding: 12,
    fontWeight: 'bold',
    color: "#1A0D0E"
  },
  logoTextRed: {
    color: "#E45959",
  }
});

export default Login;