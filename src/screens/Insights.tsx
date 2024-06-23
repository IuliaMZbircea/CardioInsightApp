import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { authentication, firestore_db } from '../../firebaseConfig';
import { collection, doc, getDoc, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { LineChart } from 'react-native-chart-kit';

type Condition = 'angina' | 'hypertension' | 'stroke' | 'general';

const InsightsScreen = () => {
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [randomHabits, setRandomHabits] = useState<string[]>([]);
  const [riskOf, setRiskOf] = useState<Condition>('general'); // Simulated test value
  const [userType, setUserType] = useState<string>('');
  const [user, setUser] = useState<any>(null);

  // Hardcoded ideal patient data
  const idealPatientData = {
    chol: 120,
    systolicBP: 110,
    diastolicBP: 70,
    BMI: 21.7,
    hr: 70,
    glucose: 70
  };

  const fetchProfileData = async () => {
    try {
      const currentUser = authentication.currentUser;
      if (currentUser) {
        const docRef = doc(firestore_db, 'MedicalFiles', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserType(data.userType);
          setUser(data);

          const userDataCollectionRef = collection(docRef, 'userData');
          const q = query(userDataCollectionRef, orderBy('createdAt', 'desc'), limit(1));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const latestDoc = querySnapshot.docs[0].data();
            setProfileData(latestDoc);
            setRandomHabits(selectRandomHabits(riskOf));
          } else {
            console.log('No such document!');
          }
        }
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectRandomHabits = (condition: Condition): string[] => {
    const healthyHabits = {
      angina: [
        "Engage in light physical activities like walking or gentle yoga.",
        "Avoid heavy meals and eat smaller, more frequent meals.",
        "Manage stress through breathing exercises and mindfulness.",
        "Avoid extreme temperatures; stay cool in summer and warm in winter.",
        "Limit caffeine intake to reduce heart strain.",
        "Take prescribed medications regularly and follow up with your doctor.",
        "Include omega-3 fatty acids in your diet from sources like fish or flaxseed.",
        "Practice relaxation techniques to control anxiety and improve heart function.",
        "Stay hydrated but avoid excessive fluid intake at once."
      ],
      hypertension: [
        "Reduce salt intake by avoiding processed foods and reading food labels.",
        "Practice relaxation techniques such as meditation or deep breathing.",
        "Increase intake of potassium-rich foods like bananas and spinach.",
        "Maintain a healthy weight to reduce blood pressure strain.",
        "Exercise regularly, aiming for at least 30 minutes of moderate activity most days.",
        "Limit alcohol consumption to no more than one drink per day for women and two for men.",
        "Avoid smoking and exposure to secondhand smoke.",
        "Monitor blood pressure at home and keep a log for your doctor.",
        "Reduce intake of saturated fats and cholesterol to maintain healthy blood vessels."
      ],
      stroke: [
        "Participate in physical therapy to improve mobility and strength.",
        "Follow a diet low in saturated fats and high in fiber.",
        "Take medications as prescribed and attend regular check-ups.",
        "Engage in cognitive exercises to improve brain function.",
        "Stay physically active within your limits to improve circulation.",
        "Control diabetes through diet, exercise, and medication if needed.",
        "Avoid excessive alcohol consumption to reduce stroke risk.",
        "Manage stress through support groups, therapy, or relaxation techniques.",
        "Monitor for signs of stroke and seek immediate help if they occur."
      ],
      general: [
        "Maintain a balanced diet rich in fruits, vegetables, and whole grains.",
        "Engage in regular physical activity such as brisk walking, jogging, or cycling.",
        "Quit smoking and avoid exposure to secondhand smoke.",
        "Manage stress through relaxation techniques like yoga or meditation.",
        "Monitor blood pressure and cholesterol levels regularly as per your doctor's advice.",
        "Limit alcohol consumption to moderate levels.",
        "Ensure adequate sleep of at least 7-8 hours per night.",
        "Stay hydrated by drinking plenty of water throughout the day.",
        "Maintain a healthy weight through a combination of diet and exercise.",
        "Practice good hygiene to prevent infections.",
        "Get regular health check-ups and screenings.",
        "Stay socially connected to support mental health.",
        "Avoid excessive sugar intake to prevent diabetes and other health issues."
      ]
    };

    const habits = healthyHabits[condition] || healthyHabits.general;
    return habits.sort(() => 0.5 - Math.random()).slice(0, 3);
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  if (loading || !profileData) {
    return <ActivityIndicator size="large" color="rgba(200, 48, 48, 0.6)" />;
  }

const lineChartData = {
  labels: userType === 'basic' ? ['BMI', 'HR'] : ['Chol', 'Sys-BP', 'Dia-BP', 'BMI', 'HR', 'Glucose'],
  datasets: [
    {
      data: userType === 'basic' 
          ? [profileData.BMI, profileData.hr]
          : [
            profileData.chol,
            profileData.systolicBP,
            profileData.diastolicBP,
            profileData.BMI,
            profileData.hr,
            profileData.glucose
      ],
      color: (opacity = 1) => `rgba(200, 48, 48, ${opacity})`,
      strokeWidth: 2, 
      legendLabel: user.name, 
    },
    {
      data: userType === 'basic' 
          ? [idealPatientData.BMI, idealPatientData.hr]
          : [
            idealPatientData.chol,
            idealPatientData.systolicBP,
            idealPatientData.diastolicBP,
            idealPatientData.BMI,
            idealPatientData.hr,
            idealPatientData.glucose
          ],
      color: (opacity = 1) => `rgba(190, 229, 71, ${opacity})`,
      strokeWidth: 2, 
      legendLabel: 'Ideal Values', 
    },
  ],
};
const CustomLegend = () => (
  <View style={styles.legendContainer}>
    {lineChartData.datasets.map((dataset, index) => (
      <View key={index} style={styles.legendItem}>
        <View style={[styles.legendIndicator, { backgroundColor: dataset.color(1) }]} />
        <Text style={styles.legendText}>{dataset.legendLabel}</Text>
      </View>
    ))}
  </View>
);


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>User Data Parameters</Text>
          <LineChart
            data={lineChartData}
            width={Dimensions.get('window').width - 40} // from react-native
            height={220}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: '#F8F3F3',
              backgroundGradientFrom: '#F8F3F3',
              backgroundGradientTo: '#F8F3F3',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(200, 48, 48, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(200, 48, 48, ${opacity})`,
              style: {
                borderRadius: 10
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#C83030"
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 10
            }}
          />
          <CustomLegend />
          </View>
          <View>
            <Text style={styles.title}>Healthy Habits Handbook</Text>
          {randomHabits.map((habit, index) => (
            <Text key={index} style={styles.habitText}>{`${index + 1}. ${habit}`}</Text>
          ))}
          
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  contentContainer: {
    backgroundColor: '#F8F3F3',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#C83030',
    marginBottom: 10,
  },
  habitText: {
    fontSize: 18,
    marginTop:10,
    lineHeight: 24,
    color: '#D68E8D',
    marginBottom: 10,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
  },
});


export default InsightsScreen;
