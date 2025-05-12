// // app/red-button.tsx
// import React, { useRef, useState } from "react";
// import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
// import { TextInput } from "react-native-gesture-handler";

// export default function RedButtonScreen() {
//   const scale = useRef(new Animated.Value(1)).current;
//   const [buttonDisabled, setButtonDisabled] = useState(false);
//   const [greetbuttonDisabled, setGreetButtonDisabled] = useState(false);
//   const [inputTxt, setInputTxt] = useState("");

//   const handlePressIn = () => {
//     Animated.spring(scale, {
//       toValue: 0.9,
//       useNativeDriver: true,
//     }).start();
//   };

//   const handlePressOut = () => {
//     Animated.spring(scale, {
//       toValue: 1,
//       useNativeDriver: true,
//     }).start();
//   };

//   const buttonClick = async () => {
//     setButtonDisabled(true);
//     const response = await fetch("http://localhost:8080/pakora", {
//       method: "POST",
//     });
//     const resJson = await response.json();
//     alert(resJson.content);
//     setButtonDisabled(false);
//   };

//   const getGreeting = async () => {
//     setGreetButtonDisabled(true);
//     const response = await fetch("http://localhost:8080/introduction", {
//       method: "POST",
//       headers: {
//         "Content-type": "application/json",
//       },
//       body: JSON.stringify({
//         name: inputTxt,
//       }),
//     });
//     const resJson = await response.json();
//     alert(resJson.intro);
//     setGreetButtonDisabled(false);
//   };

//   return (
//     <View style={styles.container}>
//       <Animated.View style={{ transform: [{ scale }] }}>
//         <Pressable
//           onPressIn={handlePressIn}
//           onPressOut={handlePressOut}
//           onPress={buttonClick}
//           style={{ opacity: buttonDisabled ? 0.5 : 1, ...styles.button }}
//           disabled={buttonDisabled}
//         >
//           <Text style={styles.buttonText}>
//             {buttonDisabled ? "Loading..." : "Press me senpai :3"}
//           </Text>
//         </Pressable>
//       </Animated.View>
//       <View>
//         <TextInput
//           style={styles.textField}
//           onChangeText={setInputTxt}
//           value={inputTxt}
//         />
//         <Pressable
//           style={{
//             opacity: greetbuttonDisabled ? 0.5 : 1,
//             ...styles.simpleButton,
//           }}
//           disabled={greetbuttonDisabled}
//           onPress={getGreeting}
//         >
//           <Text style={styles.blueText}>
//             {greetbuttonDisabled ? "Loading..." : "get greeted by backend"}
//           </Text>
//         </Pressable>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   blueText: {
//     color: "blue",
//     textDecorationLine: "underline",
//   },
//   button: {
//     backgroundColor: "red",
//     paddingVertical: 14,
//     paddingHorizontal: 28,
//     borderRadius: 10,
//     elevation: 3,
//   },
//   simpleButton: {
//     backgroundColor: "black",
//     paddingVertical: 8,
//     borderRadius: 10,
//     elevation: 3,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "white",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   textField: {
//     backgroundColor: "white",
//     padding: 14,
//     color: "black",
//   },
// });
