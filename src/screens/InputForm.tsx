// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
// import { RouteProp } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../App';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import { firestore_db } from '../../firebaseConfig';

// type ParameterDetailsScreenRouteProp = RouteProp<RootStackParamList, 'ParameterDetailsScreen'>;
// type ParameterDetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ParameterDetailsScreen'>;

// type Props = {
//   route: ParameterDetailsScreenRouteProp;
//   navigation: ParameterDetailsScreenNavigationProp;
// };

// const ParameterDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
//   const { parameterKey, userId } = route.params;
//   const [loading, setLoading] = useState(true);
//   const [parameterData, setParameterData] = useState<{ date: string; value: any }[]>([]);

//   const dataLabels: { [key: string]: string } = {
//     BMI: 'BMI',
//     chol: 'Cholesterol',
//     diastolicBP: 'Avg Diastolic BP',
//     glucose: 'Glucose',
//     hr: 'Avg Heart Rate',
//     systolicBP: 'Avg Systolic BP',
//   };

//   const dataUnits: { [key: string]: string } = {
//     BMI: '',
//     chol: 'mg/dL',
//     diastolicBP: 'mmHg',
//     glucose: 'mg/dL',
//     hr: 'BPM',
//     systolicBP: 'mmHg',
//   };

//   useEffect(() => {
//     const fetchParameterData = async () => {
//       if (!parameterKey || !userId) {
//         console.error('Parameter key or user ID is undefined');
//         setLoading(false);
//         return;
//       }

//       try {
//         const q = query(
//           collection(firestore_db, 'MedicalFiles', userId, 'UserData'),
//           where('parameterName', '==', parameterKey)
//         );
//         const querySnapshot = await getDocs(q);
//         const data: { date: string; value: any }[] = [];
//         querySnapshot.forEach((doc) => {
//           data.push({
//             date: doc.data().date,
//             value: doc.data().value,
//           });
//         });
//         setParameterData(data);
//       } catch (error) {
//         console.error('Error fetching parameter data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchParameterData();
//   }, [parameterKey, userId]);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#C83030" />
//       </View>
//     );
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.header}>{dataLabels[parameterKey] || parameterKey}</Text>
//       {parameterData.length > 0 ? (
//         parameterData.map((entry, index) => (
//           <View key={index} style={styles.itemContainer}>
//             <Text style={styles.date}>{new Date(entry.date).toLocaleDateString()}</Text>
//             <Text style={styles.value}>
//               {entry.value} {dataUnits[parameterKey]}
//             </Text>
//           </View>
//         ))
//       ) : (
//         <Text style={styles.noDataText}>No data available for this parameter.</Text>
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     backgroundColor: '#f5f5f5',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     color: '#B83D37',
//   },
//   itemContainer: {
//     marginBottom: 12,
//     padding: 16,
//     backgroundColor: '#EEE6E6',
//     borderRadius: 8,
//   },
//   date: {
//     fontSize: 16,
//     color: '#555',
//   },
//   value: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#B83D37',
//   },
//   noDataText: {
//     fontSize: 18,
//     color: '#999',
//     textAlign: 'center',
//     marginTop: 20,
//   },
// });

// export default ParameterDetailsScreen;
