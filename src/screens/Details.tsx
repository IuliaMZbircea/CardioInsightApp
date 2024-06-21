import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore_db } from '../../firebaseConfig';
import Icon from 'react-native-vector-icons/Ionicons';

type ParameterDetailsScreenRouteProp = RouteProp<RootStackParamList, 'ParameterDetailsScreen'>;
type ParameterDetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ParameterDetailsScreen'>;

type Props = {
  route: ParameterDetailsScreenRouteProp;
  navigation: ParameterDetailsScreenNavigationProp;
};

const ParameterDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { parameterKey, userId } = route.params;
  const [loading, setLoading] = useState(true);
  const [parameterData, setParameterData] = useState<any[]>([]);

  const dataLabels: { [key: string]: string } = {
    BMI: 'BMI',
    chol: 'Cholesterol',
    diastolicBP: 'Avg Diastolic BP',
    glucose: 'Glucose',
    hr: 'Avg Heart Rate',
    systolicBP: 'Avg Systolic BP',
  };

  const dataUnits: { [key: string]: string } = {
    BMI: '',
    chol: 'mg/dL',
    diastolicBP: 'mmHg',
    glucose: 'mg/dL',
    hr: 'BPM',
    systolicBP: 'mmHg',
  };

  useEffect(() => {
    const fetchParameterData = async () => {
      if (!parameterKey || !userId) {
        console.error('Parameter key or user ID is undefined');
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(firestore_db, 'MedicalFiles'),
          where('uid', '==', userId)
        );
        const querySnapshot = await getDocs(q);
        const data: any[] = [];
        querySnapshot.forEach((doc) => {
          const userData = doc.data().userData;
          if (userData && userData[parameterKey]) {
            data.push({
              date: doc.data().createdAt,
              value: userData[parameterKey],
            });
          }
        });
        setParameterData(data);
      } catch (error) {
        console.error('Error fetching parameter data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParameterData();
  }, [parameterKey, userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#C83030" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.header}>{dataLabels[parameterKey] || parameterKey}</Text>
        {parameterData.length > 0 ? (
          parameterData.map((entry, index) => (
            <View key={index} style={styles.itemContainer}>
              <Text style={styles.date}>{new Date(entry.date).toLocaleDateString()}</Text>
              <Text style={styles.value}>
                {entry.value} {dataUnits[parameterKey]}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No data available for this parameter.</Text>
        )}
      </ScrollView>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
        <Icon name="chevron-back-outline" size={30} color="#B83D37" />
        <Text style={styles.goBackText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80, // Ensure enough space for the button
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#B83D37',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  itemContainer: {
    marginBottom: 12,
    padding: 16,
    backgroundColor: '#EEE6E6',
    borderRadius: 8,
  },
  date: {
    fontSize: 16,
    color: '#555',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B83D37',
  },
  noDataText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  goBackButton: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    
    elevation: 5,
  },
  goBackText: {
    fontSize: 18,
    color: '#B83D37',
    marginLeft: 8,
  },
});

export default ParameterDetailsScreen;
