import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { collection, query, orderBy, limit, doc, getDoc, getDocs } from 'firebase/firestore';
import { authentication, firestore_db } from '../../firebaseConfig';
import Icon from 'react-native-vector-icons/Ionicons';

const MedicalHistoryScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<string>('');
  const [user, setUser] = useState<any>(null);

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
    
            // Fetch the latest entry from userData subcollection
            const userDataCollectionRef = collection(docRef, 'userData');
            const q = query(userDataCollectionRef, orderBy('createdAt', 'desc'), limit(1));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
              const latestDoc = querySnapshot.docs[0].data();
              setProfileData(latestDoc);
            } else {
              console.log('No userData documents found');
            }
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

  
  useFocusEffect(
    React.useCallback(() => {
      fetchProfileData();
    }, [])
  );

  const formatDate = (timestamp: any): string => {
    const date = timestamp.toDate();
    const options = { month: 'short', year: 'numeric', day: 'numeric' };
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

  // Get sorted keys of profileData
  const sortedKeys = Object.keys(profileData).sort();

  const filteredKeys = userType === 'basic' 
    ? sortedKeys.filter(key => ['BMI', 'hr'].includes(key)) 
    : sortedKeys;

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardDismissMode='on-drag'>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{user.name}</Text>
        <Text style={styles.subHeader}>{userType === 'advanced' ? 'Advanced User' : 'Basic User'}</Text>
      </View>
      <Text style={styles.sectionHeader}>Latest Medical Data</Text>
      {filteredKeys.map((key, index) => (
        dataLabels[key] && (
          <TouchableOpacity key={index} style={styles.itemContainer} onPress={() => handleParameterPress(key)}>
            <View style={styles.leftContainer}>
              <Text style={styles.title}>{dataLabels[key]}</Text>
              <Text style={styles.value}>
                {profileData[key]} {dataUnits[key] || ''}
              </Text>
            </View>
            <View style={styles.rightContainer}>
              {key !== 'createdAt' && (
                <Icon name="chevron-forward-outline" size={24} color={styles.value.color} />
              )}
            </View>
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
    fontSize: 26,
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
  leftContainer: {
    flex: 1,
  },
  rightContainer: {
    marginLeft: 10,
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
});

export default MedicalHistoryScreen;
