import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { authentication, firestore_db } from '../../firebaseConfig';
import { collection, doc, getDoc, getDocs, limit, orderBy, query } from 'firebase/firestore';
import axios from 'axios';

type ParameterRanges = {
  age: { min: number; max: number; ideal: number };
  sex: { min: number; max: number; ideal: number };
  prevCHD: { min: number; max: number; ideal: number };
  cholesterol: { min: number; max: number; ideal: number };
  systolicBP: { min: number; max: number; ideal: number };
  diastolicBP: { min: number; max: number; ideal: number };
  smoker: { min: number; max: number; ideal: number };
  BMI: { min: number; max: number; ideal: number };
  heartRate: { min: number; max: number; ideal: number };
  glucose: { min: number; max: number; ideal: number };
};

type ParameterWeights = {
  age: number;
  sex: number;
  prevCHD: number;
  cholesterol: number;
  systolicBP: number;
  diastolicBP: number;
  smoker: number;
  BMI: number;
  heartRate: number;
  glucose: number;
};

const parameterRanges: ParameterRanges = {
  age: { min: 18, max: 81, ideal: 30 },
  sex: { min: 1, max: 2, ideal: 2 },
  prevCHD: { min: 0, max: 1, ideal: 0 },
  cholesterol: { min: 100, max: 200, ideal: 120 },
  systolicBP: { min: 90, max: 120, ideal: 110 },
  diastolicBP: { min: 60, max: 80, ideal: 70 },
  smoker: { min: 0, max: 1, ideal: 0 },
  BMI: { min: 18.5, max: 24.9, ideal: 21.7 },
  heartRate: { min: 60, max: 100, ideal: 70 },
  glucose: { min: 70, max: 100, ideal: 70 },
};

const parameterWeights: ParameterWeights = {
  age: 0.1,
  sex: 0.05,
  prevCHD: 0.25,
  cholesterol: 0.1,
  systolicBP: 0.1,
  diastolicBP: 0.1,
  smoker: 0.1,
  BMI: 0.1,
  heartRate: 0.05,
  glucose: 0.05,
};

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [wellnessScore, setWellnessScore] = useState<number | null>(null);
  const [riskOf, setRiskOf] = useState<string>("Calculating risk...");
  const [showSpan, setShowSpan] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const currentUser = authentication.currentUser;
      if (currentUser) {
        console.log('Fetching profile data for user:', currentUser.uid);
        const docRef = doc(firestore_db, 'MedicalFiles', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUser(data);
          console.log('User profile data:', data);

          // Fetch the latest entry from userData subcollection
          const userDataCollectionRef = collection(docRef, 'userData');
          const q = query(userDataCollectionRef, orderBy('createdAt', 'desc'), limit(1));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const latestUserData = querySnapshot.docs[0].data();
            setProfileData(latestUserData);
            console.log('Latest user data:', profileData);

            const score = calculateWellnessScore(profileData);
            setWellnessScore(score);
            console.log('Calculated wellness score:', score);

            const dataToSend = {
              SEX: parseInt(profileData.sex),
  AGE: parseInt(profileData.age),
  CURSMOKE: parseInt(profileData.smoker),
  PREVCHD: parseInt(profileData.prevCHD),
  TOTCHOL: parseFloat(profileData.chol),
  SYSBP: parseFloat(profileData.systolicBP),
  DIABP: parseFloat(profileData.diastolicBP),
  BMI: parseFloat(profileData.BMI),
  HEARTRTE: parseFloat(profileData.hr),
  GLUCOSE: parseFloat(profileData.glucose),

            };
            handlePredictClick(dataToSend);
           
      
    } }}}catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePredictClick = async (latestUserData: { SEX: number; AGE: number; CURSMOKE: number; PREVCHD: number; TOTCHOL: number; SYSBP: number; DIABP: number; BMI: number; HEARTRTE: number; GLUCOSE: number; }) => {
    const url = "http://localhost:5002/predict";
    setLoading(true);

    // Add a log to verify userData
    console.log('Data to send:', latestUserData);

    try {
        const response = await fetch(url, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(latestUserData), // Ensure userData is stringified here
        });

        const responseData = await response.json();
        if (response.ok) {
            setRiskOf(responseData.predicted_disease);
        } else {
            console.error('Error in API response:', responseData.error);
        }
    } catch (error) {
        console.error('Error in API call:', error);
    } finally {
        setLoading(false);
        setShowSpan(true);
    }
};


  useFocusEffect(
    React.useCallback(() => {
      fetchProfileData();
    }, [])
  );

  const calculateParameterScore = (paramName: keyof ParameterRanges, value: any): number => {
    const range = parameterRanges[paramName];
    const normalizedValue = normalize(value, range.min, range.max);
    const idealValue = normalize(range.ideal, range.min, range.max);

    // Calculate score based on proximity to ideal value
    const proximityScore = 1 - Math.abs(normalizedValue - idealValue);

    // Apply weight to parameter score
    return parameterWeights[paramName] * proximityScore;
  };

  const calculateWellnessScore = (params: any): number => {
    // Calculate score for each parameter and sum up
    let totalScore = 0;
    Object.keys(params).forEach((paramName) => {
      if (params[paramName] !== undefined && parameterWeights[paramName as keyof ParameterWeights]) {
        totalScore += calculateParameterScore(paramName as keyof ParameterRanges, params[paramName]);
      }
    });

    // Final wellness score calculation
    const wellnessScore = Math.max(0, totalScore) * 100; // Ensure score is non-negative

    return Math.round(wellnessScore * 100) / 100;
  };

  const normalize = (value: number, min: number, max: number): number => {
    if (value <= min) return 0;
    if (value >= max) return 1;
    return (value - min) / (max - min);
  };

  const handleInfoButton = () => {
    Alert.alert(
      'Info',
      'The Wellness Score is a straightforward arithmetic function scaled to a maximum of 100. It is calculated using various parameters from your medical data record. This score provides an easy-to-understand summary of your overall health status.',
      [{ text: 'OK' }]
    );
  };

  const handleInsights = () => {
    navigation.navigate("InsightsScreen");
  };

  function getCurrentDate(): React.ReactNode {
    const date = new Date();
    return date.toDateString();
  }

  if (loading) {
    return <ActivityIndicator size="large" color="rgba(200, 48, 48, 0.6)" />;
  }

  if (!user) {
    return <Text>No profile data found</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userTypeContainerWrapper}>
        <View style={styles.userInfo}>
          <Text style={styles.userInfoText}>Hello, {user.name}!</Text>
        </View>
        <View style={styles.innerContainer}>
          <View style={styles.scoreContainer}>
            {wellnessScore !== null ? (
              <AnimatedCircularProgress
                size={200}
                width={18}
                fill={wellnessScore}
                tintColor="#C83030"
                backgroundColor="#EAE8E8"
                padding={10}
                lineCap="round"
              >
                {(fill) => (
                  <Text style={styles.progressText}>
                    {Math.round(fill)}
                  </Text>
                )}
              </AnimatedCircularProgress>
            ) : (
              <Text style={styles.progressText}>Calculating...</Text>
            )}
            <Text style={[styles.text, { marginBottom: 5 }, { marginTop: 40 }]}>Your Wellness Score</Text>
            <Text style={styles.dateText}>({getCurrentDate()})</Text>
          </View>
          <TouchableOpacity onPress={handleInfoButton} style={styles.infoButton}>
            <Text style={styles.infoButtonText}>What's the Wellness Score?</Text>
          </TouchableOpacity>
          <View style={styles.riskContainer}>
            
              <Text style={styles.text}>Risk of: {riskOf}</Text>

          </View>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleInsights}>
          <Text style={styles.buttonText}>See Insights</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFCFC',
  },
  userTypeContainerWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  innerContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#C83030',
  },
  progressText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#C83030',
  },
  text: {
    color: '#C83030',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dateText: {
    color: '#D68E8D',
    fontSize: 16,
    marginBottom: 10,
  },
  buttonText: {
    color: '#C83030',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#EEE6E6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 30,
  },
  riskContainer: {
    marginTop: '10%',
  },
  infoButtonText: {
    color: '#D68E8D',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  infoButton: {
    backgroundColor: '#FFFCFC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  userInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
  userInfoText: {
    fontSize: 32,
    color: '#D68E8D',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;