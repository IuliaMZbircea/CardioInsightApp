import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, addDoc, collection, serverTimestamp, getDoc } from 'firebase/firestore';
import { authentication, firestore_db } from '../../firebaseConfig';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';

const NewMedicalRecordScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [userType, setUserType] = useState<string>('');
  const [bmi, setBmi] = useState('');
  const [hr, setHr] = useState('');
  const [systolicBP, setSystolicBP] = useState('');
  const [diastolicBP, setDiastolicBP] = useState('');
  const [chol, setChol] = useState('');
  const [glucose, setGlucose] = useState('');
  const [age, setAge] = useState('');
  const [smoker, setSmoker] = useState('');
  const [prevCHD, setPrevCHD] = useState('');
  const [sex, setSex] = useState('');

  const [showSexPicker, setShowSexPicker] = useState(false);
  const [showCHDPicker, setShowCHDPicker] = useState(false);
  const [showSmokerPicker, setShowSmokerPicker] = useState(false);

  useEffect(() => {
    const fetchUserType = async () => {
      const currentUser = authentication.currentUser;
      if (currentUser) {
        const docRef = doc(firestore_db, 'MedicalFiles', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserType(data.userType);
        }
      }
    };

    fetchUserType();
  }, []);

  const handleAddRecord = async () => {
    const currentUser = authentication.currentUser;
    if (currentUser) {
      const docRef = doc(firestore_db, 'MedicalFiles', currentUser.uid);
      const userDataCollectionRef = collection(docRef, 'userData');
      const newRecord = {
        createdAt: serverTimestamp(),
        BMI: bmi,
        hr: hr,
        age,
        smoker: smoker === 'Yes' ? '1' : '0',
        prevCHD: prevCHD === 'Yes' ? '1' : '0',
        sex: sex === 'Male' ? '1' : sex === 'Female' ? '2' : '',
        systolicBP: userType === 'basic' ? '110' : systolicBP,
        diastolicBP: userType === 'basic' ? '70' : diastolicBP,
        chol: userType === 'basic' ? '120' : chol,
        glucose: userType === 'basic' ? '70': glucose,
        ...(userType === 'advanced' && { systolicBP, diastolicBP, chol, glucose }),
      };

      try {
        await addDoc(userDataCollectionRef, newRecord);
        alert('New medical record added successfully');
        navigation.goBack();
      } catch (error) {
        console.error('Error adding document: ', error);
        alert('Error adding medical record');
      }
    }
  };

  return (
    <View style={styles.container}>

      
      <Text style={styles.header}>New Medical Record</Text>
      <TextInput
        style={styles.input}
        placeholder="Age"
        placeholderTextColor={'#B83D37'}
        value={age}
        onChangeText={setAge}
      />
    
      <TouchableOpacity style={styles.input} onPress={() => setShowSexPicker(true)}>
        <Text style={{color: '#B83D37'}}>{sex || 'Gender'}</Text>
      </TouchableOpacity>
      

      <TouchableOpacity style={styles.input} onPress={() => setShowSmokerPicker(true)}>
        <Text style={{color: '#B83D37'}}>{smoker || 'Smoker'}</Text>
      </TouchableOpacity>
      

      <TouchableOpacity style={styles.input} onPress={() => setShowCHDPicker(true)}>
        <Text style={{color: '#B83D37'}}>{prevCHD || 'Diagnosed CVD'}</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="BMI"
        placeholderTextColor={'#B83D37'}
        value={bmi}
        onChangeText={setBmi}
      />
      <TextInput
        style={styles.input}
        placeholder="Heart Rate"
        placeholderTextColor={'#B83D37'}
        value={hr}
        onChangeText={setHr}
      />
      {userType === 'advanced' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Systolic BP"
            placeholderTextColor={'#B83D37'}
            value={systolicBP}
            onChangeText={setSystolicBP}
          />
          <TextInput
            style={styles.input}
            placeholder="Diastolic BP"
            placeholderTextColor={'#B83D37'}
            value={diastolicBP}
            onChangeText={setDiastolicBP}
          />
          <TextInput
            style={styles.input}
            placeholder="Cholesterol"
            placeholderTextColor={'#B83D37'}
            value={chol}
            onChangeText={setChol}
          />
          <TextInput
            style={styles.input}
            placeholder="Glucose"
            placeholderTextColor={'#B83D37'}
            value={glucose}
            onChangeText={setGlucose}
          />
        </>
      )}
      <Button title="Add Record" onPress={handleAddRecord} />

      <Modal visible={showSexPicker} transparent={true} animationType="slide">
        <View style={styles.pickerContainer}>
          <TouchableOpacity onPress={() => setShowSexPicker(false)}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
          <Picker
            selectedValue={sex}
            onValueChange={(itemValue) => {
              setSex(itemValue);
              setShowSexPicker(false);
            }}
          >
            <Picker.Item label="Select Sex" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
          </Picker>
        </View>
      </Modal>

      <Modal visible={showSmokerPicker} transparent={true} animationType="slide">
        <View style={styles.pickerContainer}>
          <TouchableOpacity onPress={() => setShowSmokerPicker(false)}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
          <Picker
            selectedValue={smoker}
            onValueChange={(itemValue) => {
              setSmoker(itemValue);
              setShowSmokerPicker(false);
            }}
          >
            <Picker.Item label="Smoker" value="" />
            <Picker.Item label="Yes" value="Yes" />
            <Picker.Item label="No" value="No" />
          </Picker>
        </View>
      </Modal>

      <Modal visible={showCHDPicker} transparent={true} animationType="slide">
        <View style={styles.pickerContainer}>
          <TouchableOpacity onPress={() => setShowCHDPicker(false)}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
          <Picker
            selectedValue={prevCHD}
            onValueChange={(itemValue) => {
              setPrevCHD(itemValue);
              setShowCHDPicker(false);
            }}
          >
            <Picker.Item label="Diagnosed CVD" value="" />
            <Picker.Item label="Yes" value="Yes" />
            <Picker.Item label="No" value="No" />
          </Picker>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#B83D37',
  },
  input: {
    height: 40,
    borderColor: '#E4BEBD',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    color: '#B83D37',
    marginBottom: 10,
  },
  
});

export default NewMedicalRecordScreen;
