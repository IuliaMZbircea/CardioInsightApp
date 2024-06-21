import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { authentication, firestore_db } from '../../firebaseConfig';

const InsightsScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<string>('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const currentUser = authentication.currentUser;
        if (currentUser) {
          const docRef = doc(firestore_db, 'MedicalFiles', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfileData(data.userData);
            setUserType(data.userType);
            setUser(data);
          } else {
            console.log('No such document!');
          }
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const formatDate = (timestamp: any): string => {
    const date = new Date(timestamp);
    const options = { month: 'short', year: 'numeric' } as const;
    return date.toLocaleDateString('en-US', options);
  };

  const dataLabels: { [key: string]: string } = {
    BMI: 'BMI',
    chol: 'Cholesterol',
    diastolicBP: 'Avg Diastolic BP',
    glucose: 'Glucose',
    hr: 'Avg Heart Rate',
    systolicBP: 'Avg Systolic BP',
  };

  const dataUnits: { [key: string]: string } = {
    systolicBP: 'mmHg',
    diastolicBP: 'mmHg',
    chol: 'mg/dL',
    glucose: 'mg/dL',
    hr: 'BPM',
  };

  const handleParameterPress = (key: string) => {
    navigation.navigate('ParameterDetailsScreen', { parameterKey: key, userId: authentication.currentUser?.uid });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#C83030" />
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={styles.container}>
        <Text>No medical data found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardDismissMode='on-drag'>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{user.name}</Text>
        <Text style={styles.subHeader}>{userType === 'advanced' ? 'Advanced User' : 'Basic User'}</Text>
      </View>
      <Text style={styles.sectionHeader}>Past 12 Months</Text>
      {Object.keys(profileData).map((key, index) => (
        dataLabels[key] && (
          <TouchableOpacity key={index} style={styles.itemContainer} onPress={() => handleParameterPress(key)}>
            <View>
              <Text style={styles.title}>{dataLabels[key]}</Text>
              <Text style={styles.value}>
                {profileData[key]} {dataUnits[key] || ''}
              </Text>
            </View>
            <Text style={styles.date}>{formatDate(user.createdAt)}</Text>
          </TouchableOpacity>
        )
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    backgroundColor: '#EEE6E6',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#B83D37',
  },
  subHeader: {
    fontSize: 15,
    color: '#E4BEBD',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#B83D37',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#EEE6E6',
    borderRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#B83D37',
  },
  value: {
    fontSize: 26,
    marginTop: 5,
    fontWeight: 'bold',
    color: '#7D7878',
  },
  date: {
    fontSize: 14,
    color: '#a0a0a0',
  },
});

export default InsightsScreen;


// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
// import { StackedBarChart } from 'react-native-chart-kit';
// import { useNavigation } from '@react-navigation/native';
// import { doc, getDoc } from 'firebase/firestore';
// import { authentication, firestore_db } from '../../firebaseConfig';


// const InsightsScreen: React.FC = () => {
//   const navigation = useNavigation<any>();

//   const [chartData, setChartData] = useState<{
//     labels: string[],
//     data: number[][],
//     legend: string[],
//     barColors: string[]
//   }>({
//     labels: [],
//     data: [],
//     legend: ['Prev CHD', 'Cholesterol', 'Systolic BP', 'Diastolic BP', 'Smoker', 'BMI', 'Heart Rate', 'Glucose'],
//     barColors: ['#B83D37', '#E4BEBD', '#7D7878', '#EEE6E6', '#C83030', '#A0A0A0', '#B83D37', '#E4BEBD', '#7D7878', '#EEE6E6'],
//   });
//   const [loading, setLoading] = useState(true);
//   const [parameterRanges, setParameterRanges] = useState<ParameterRanges>({
//     prevCHD: { min: 0, max: 1, ideal: 0 },
//     chol: { min: 100, max: 200, ideal: 120 },
//     systolicBP: { min: 90, max: 120, ideal: 110 },
//     diastolicBP: { min: 60, max: 80, ideal: 70 },
//     smoker: { min: 0, max: 1, ideal: 0 },
//     BMI: { min: 18.5, max: 24.9, ideal: 21.7 },
//     hr: { min: 60, max: 100, ideal: 70 },
//     glucose: { min: 70, max: 100, ideal: 70 },
//   });

//   useEffect(() => {
//     const fetchChartData = async () => {
//       try {
//         const currentUser = authentication.currentUser;
//         if (currentUser) {
//           const docRef = doc(firestore_db, 'MedicalFiles', currentUser.uid);
//           const docSnap = await getDoc(docRef);
//           if (docSnap.exists()) {
//             const data = docSnap.data() as HealthData;

//             // Validate data before setting state
//             const validData = [
//               data.prevCHD ?? 0,
//               data.chol ?? 0,
//               data.systolicBP ?? 0,
//               data.diastolicBP ?? 0,
//               data.smoker ?? 0,
//               data.BMI ?? 0,
//               data.hr ?? 0,
//               data.glucose ?? 0,
//             ].map(value => (isNaN(value) ? 0 : value));

//             setChartData({
//               labels: ['Prev CHD', 'Cholesterol', 'Systolic BP', 'Diastolic BP', 'Smoker', 'BMI', 'Heart Rate', 'Glucose'],
//               data: [validData],
//               legend: ['Prev CHD', 'Cholesterol', 'Systolic BP', 'Diastolic BP', 'Smoker', 'BMI', 'Heart Rate', 'Glucose'],
//               barColors: ['#B83D37', '#E4BEBD', '#7D7878', '#EEE6E6', '#C83030', '#A0A0A0', '#B83D37', '#E4BEBD', '#7D7878', '#EEE6E6'],
//             });
//           } else {
//             console.log('Document does not exist');
//           }
//         } else {
//           console.log('No current user found');
//         }
//       } catch (error) {
//         console.error('Error fetching chart data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchChartData();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#C83030" />
//       </View>
//     );
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container} keyboardDismissMode='on-drag'>
//       <Text style={styles.sectionHeader}>Health Insights</Text>
//       <StackedBarChart
//         style={styles.chart}
//         data={{
//           labels: chartData.labels,
//           legend: chartData.legend,
//           data: chartData.data,
//           barColors: chartData.barColors,
//         }}
//         width={Dimensions.get('window').width - 20}
//         height={400}
//         hideLegend={false}
//         chartConfig={{
//           backgroundGradientFrom: '#f5f5f5',
//           backgroundGradientTo: '#f5f5f5',
//           decimalPlaces: 0,
//           color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//           labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//           style: {
//             borderRadius: 10,
//           },
//         }}
//       />
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 10,
//     paddingBottom: 20,
//     paddingTop: 10,
//     backgroundColor: '#f5f5f5',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   sectionHeader: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     color: '#B83D37',
//     textAlign: 'center',
//   },
//   chart: {
//     marginVertical: 8,
//     borderRadius: 16,
//   },
// });

// export default InsightsScreen;
