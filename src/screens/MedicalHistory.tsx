import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { authentication, firestore_db } from '../../firebaseConfig';

const MedicalHistoryScreen: React.FC = () => {
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

export default MedicalHistoryScreen;
