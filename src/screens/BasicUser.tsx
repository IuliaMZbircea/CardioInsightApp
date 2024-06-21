// import React, { useState } from 'react';
// import { View, TextInput, Button, StyleSheet, KeyboardAvoidingView, Text, SafeAreaView } from 'react-native';
// import { updateDoc, doc } from 'firebase/firestore';
// import { firestore_db } from '../../firebaseConfig';
// import { useNavigation } from '@react-navigation/native';

// const BasicUserScreen = ({ route }: any) => {
//   const { docId } = route.params;
//   const [age, setAge] = useState('');
//   const [sex, setSex] = useState('');
//   const [prevCHD, setPrevCHD] = useState('');
//   const [BMI, setBMI] = useState('');
//   const [height, setHeight] = useState('');
//   const [weight, setWeight] = useState('');
//   const [smoker, setSmoker] = useState('');
//   const [hr, setHR] = useState('');

//   const navigation = useNavigation<any>();

//   const calculateBMI = () => {
//     if (height && weight) {
//       const heightInMeters = parseFloat(height) / 100; // Convert height to meters
//       const weightInKg = parseFloat(weight);
//       const calculatedBMI = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1); // Calculate BMI
//       setBMI(calculatedBMI); // Update state with calculated BMI
//     } else {
//       setBMI(''); // Clear BMI if height or weight is not entered
//     }
//   };

//   const handleSubmitForm = async () => {
//     try {
//       const medicalFileRef = doc(firestore_db, 'MedicalFiles', docId);
//       await updateDoc(medicalFileRef, {
//         age: age,
//         sex: sex,
//         prevCHD: prevCHD,
//         BMI: BMI,
//         smoker: smoker,
//         hr: hr,
//       });

//       // Clear form inputs after submission
//       setAge('');
//       setSex('');
//       setPrevCHD('');
//       setBMI('');
//       setSmoker('');
//       setHR('');
//       setHeight('');
//       setWeight('');

//       // Navigate to ProfileScreen
//       navigation.navigate('ProfileScreen', {
//         age,
//         sex,
//         prevCHD,
//         BMI,
//         smoker,
//         hr,
//       });
//     } catch (error) {
//       console.error('Error updating document: ', error);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView style={styles.userTypeContainerWrapper}>
//         <View style={styles.userTypeContainer}>
//           <Text style={styles.userTypeTitle}>Let's start with the basics...</Text>

//           <View style={styles.formRow}>
//             <View style={styles.formColumn}>
//               <TextInput
//                 style={styles.formInput}
//                 value={age}
//                 onChangeText={(text) => setAge(text)}
//                 placeholder="Age"
//                 placeholderTextColor="#C83030"
//                 keyboardType="numeric"
//                 editable={true}
//               />
//             </View>
//             <View style={styles.formColumn}>
//               <TextInput
//                 style={styles.formInput}
//                 value={sex}
//                 onChangeText={(text) => setSex(text)}
//                 placeholder="Gender"
//                 placeholderTextColor="#C83030"
//                 editable={true}
//               />
//             </View>
//           </View>

//           <View style={styles.formRow}>
//             <View style={styles.formColumn}>
//               <TextInput
//                 style={styles.formInput}
//                 value={prevCHD}
//                 onChangeText={(text) => setPrevCHD(text)}
//                 placeholder="Diagnosed CVD"
//                 placeholderTextColor="#C83030"
//                 editable={true}
//               />
//             </View>
//             <View style={styles.formColumn}>
//               <TextInput
//                 style={styles.formInput}
//                 value={hr}
//                 onChangeText={(text) => setHR(text)}
//                 placeholder="Heart Rate"
//                 placeholderTextColor="#C83030"
//                 keyboardType="numeric"
//                 editable={true}
//               />
//             </View>
//           </View>

//           <View style={styles.formRow}>
//             <View style={styles.formColumn}>
//               <TextInput
//                 style={styles.formInput}
//                 value={height}
//                 onChangeText={(text) => setHeight(text)}
//                 placeholder="Height"
//                 placeholderTextColor="#C83030"
//                 keyboardType="numeric"
//                 onBlur={calculateBMI} 
//                 editable={true}
//               />
//             </View>
//             <View style={styles.formColumn}>
//               <TextInput
//                 style={styles.formInput}
//                 value={weight}
//                 onChangeText={(text) => setWeight(text)}
//                 placeholder="Weight"
//                 placeholderTextColor="#C83030"
//                 keyboardType="numeric"
//                 onBlur={calculateBMI} 
//                 editable={true}
//               />
//             </View>
//           </View>

//           <View style={styles.formRow}>
//             <View style={styles.formColumn}>
//               <TextInput
//                 style={styles.formInput}
//                 value={smoker}
//                 onChangeText={(text) => setSmoker(text)}
//                 placeholder="Smoker"
//                 placeholderTextColor="#C83030"
//                 keyboardType="numeric"
//                 editable={true}
//               />
//             </View>
//             <View style={styles.formColumn}>
//               <TextInput
//                 style={styles.formInput}
//                 value={BMI}
//                 onChangeText={(text) => setBMI(text)}
//                 placeholder="BMI"
//                 placeholderTextColor="#C83030"
//                 keyboardType="numeric"
//                 editable={true}
//               />
//             </View>
//           </View>

//           <Button title="Submit" color="#C83030" onPress={handleSubmitForm} />
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//     padding: 20,
//     justifyContent: 'center',
//   },
//   userTypeContainerWrapper: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   userTypeContainer: {
//     backgroundColor: '#EEE6E6',
//     borderRadius: 15,
//     padding: 30,
//     width: '90%',
//     marginBottom: 20,
//   },
//   userTypeTitle: {
//     color: '#C83030',
//     fontSize: 20,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   formInput: {
//     height: 40,
//     borderColor: 'rgba(255, 255, 255, 0.6)',
//     borderWidth: 1,
//     borderRadius: 10,
//     marginBottom: 10,
//     paddingLeft: 10,
//     color: '#C83030',
//     backgroundColor: 'rgba(255, 255, 255, 0.6)',
//   },
//   formRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginVertical: 10,
//   },
//   formColumn: {
//     flex: 1,
//     marginRight: 10,
//   },
// });

// export default BasicUserScreen;
