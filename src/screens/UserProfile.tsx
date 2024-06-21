import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { authentication, firestore_db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
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
  const [wellnessScore, setWellnessScore] = useState<number | null>(null);
  const [riskOf, setRiskOf] = useState<string>("");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const currentUser = authentication.currentUser;
        if (currentUser) {
          const docRef = doc(firestore_db, 'MedicalFiles', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfileData(data);
            const score = calculateWellnessScore(data?.userData);
            setWellnessScore(score);

            // Fetch risk prediction
            const response = await axios.post('https://cardioinsight-4532f645d273.herokuapp.com/server.py ', { userData: data.userData });
            setRiskOf(response.data.predicted_disease);
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

  const normalize = (value: number, min: number, max: number): number => {
    if (value <= min) return 0;
    if (value >= max) return 1;
    return (value - min) / (max - min);
  };

  const getCurrentDate = (): string => {
    const date = new Date();
    const options = { year: 'numeric', month: 'short', day: '2-digit' } as const;
    return date.toLocaleDateString('en-US', options);
  };

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

  if (loading) {
    return <ActivityIndicator size="large" color="rgba(200, 48, 48, 0.6)" />;
  }

  if (!profileData) {
    return <Text>No profile data found</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userTypeContainerWrapper}>
        <View style={styles.userInfo}>
          <Text style={styles.userInfoText}>Hello, {profileData.name}!</Text>
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
              <Text style={styles.progressText}>N/A</Text>
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
