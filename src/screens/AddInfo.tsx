import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, KeyboardAvoidingView, Text, SafeAreaView, TouchableOpacity, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { firestore_db } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const AdvancedUserScreen = ({ route }: any) => {
  const { docId } = route.params;
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [prevCHD, setPrevCHD] = useState('');
  const [BMI, setBMI] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [chol, setChol] = useState('');
  const [smoker, setSmoker] = useState('');
  const [systolicBP, setSystolicBP] = useState('');
  const [diastolicBP, setDiastolicBP] = useState('');
  const [hr, setHR] = useState('');
  const [glucose, setGlucose] = useState('');

  const [showSexPicker, setShowSexPicker] = useState(false);
  const [showCHDPicker, setShowCHDPicker] = useState(false);
  const [showSmokerPicker, setShowSmokerPicker] = useState(false);

  const navigation = useNavigation<any>();

  useEffect(() => {
    calculateBMI();
  }, [height, weight]);

  const calculateBMI = () => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100; // Convert height to meters
      const weightInKg = parseFloat(weight);
      const calculatedBMI = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1); // Calculate BMI
      setBMI(calculatedBMI); // Update state with calculated BMI
    } else {
      setBMI(''); // Clear BMI if height or weight is not entered
    }
  };

  const handleSubmitForm = async () => {
    try {
      const userId = route.params.userId;
      const medicalFileRef = doc(firestore_db, 'MedicalFiles', userId);
      
      // Update document with additional data and createdAt timestamp
      await updateDoc(medicalFileRef, {
        userData: {
          createdAt: serverTimestamp(),
          age: age,
          sex: sex === 'Male' ? '1' : sex === 'Female' ? '2' : '',
          prevCHD: prevCHD === 'Yes' ? '1' : '0',
          BMI: BMI,
          chol: chol,
          smoker: smoker === 'Yes' ? '1' : '0',
          systolicBP: systolicBP,
          diastolicBP: diastolicBP,
          hr: hr,
          glucose: glucose,
        },
      });

      // Clear form inputs after submission
      setAge('');
      setSex('');
      setPrevCHD('');
      setBMI('');
      setChol('');
      setSmoker('');
      setSystolicBP('');
      setDiastolicBP('');
      setHR('');
      setGlucose('');
      setHeight('');
      setWeight('');

      // Navigate to ProfileScreen
      navigation.navigate('ProfileScreen', {
        userId,
      });
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.userTypeContainerWrapper}>
        <View style={styles.userTypeContainer}>
          <Text style={styles.userTypeTitle}>Prepare your medical file...</Text>

          <View style={styles.formRow}>
            <TextInput
              style={styles.formInput}
              value={age}
              onChangeText={(text) => setAge(text)}
              placeholder="Age"
              placeholderTextColor="#C83030"
              keyboardType="numeric"
              editable={true}
            />
            <TouchableOpacity style={styles.formInput} onPress={() => setShowSexPicker(true)}>
              <Text style={styles.pickerText}>{sex || 'Select Gender'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formRow}>
            <TouchableOpacity style={styles.formInput} onPress={() => setShowCHDPicker(true)}>
              <Text style={styles.pickerText}>{prevCHD || 'Diagnosed CVD'}</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.formInput}
              value={height}
              onChangeText={(text) => setHeight(text)}
              placeholder="Height (cm)"
              placeholderTextColor="#C83030"
              keyboardType="numeric"
              editable={true}
            />
          </View>

          <View style={styles.formRow}>
            <TextInput
              style={styles.formInput}
              value={weight}
              onChangeText={(text) => setWeight(text)}
              placeholder="Weight (kg)"
              placeholderTextColor="#C83030"
              keyboardType="numeric"
              editable={true}
            />
            <TextInput
              style={styles.formInput}
              value={BMI}
              placeholder="BMI"
              placeholderTextColor="#C83030"
              keyboardType="numeric"
              editable={false}
            />
          </View>

          <View style={styles.formRow}>
            <TextInput
              style={styles.formInput}
              value={chol}
              onChangeText={(text) => setChol(text)}
              placeholder="Cholesterol (mg/dL)"
              placeholderTextColor="#C83030"
              keyboardType="numeric"
              editable={true}
            />
            <TouchableOpacity style={styles.formInput} onPress={() => setShowSmokerPicker(true)}>
              <Text style={styles.pickerText}>{smoker || 'Smoker'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formRow}>
            <TextInput
              style={styles.formInput}
              value={systolicBP}
              onChangeText={(text) => setSystolicBP(text)}
              placeholder="Systolic BP (mmHg)"
              placeholderTextColor="#C83030"
              keyboardType="numeric"
              editable={true}
            />
            <TextInput
              style={styles.formInput}
              value={diastolicBP}
              onChangeText={(text) => setDiastolicBP(text)}
              placeholder="Diastolic BP (mmHg)"
              placeholderTextColor="#C83030"
              keyboardType="numeric"
              editable={true}
            />
          </View>

          <View style={styles.formRow}>
            <TextInput
              style={styles.formInput}
              value={hr}
              onChangeText={(text) => setHR(text)}
              placeholder="Heart Rate (BPM)"
              placeholderTextColor="#C83030"
              keyboardType="numeric"
              editable={true}
            />
            <TextInput
              style={styles.formInput}
              value={glucose}
              onChangeText={(text) => setGlucose(text)}
              placeholder="Glucose (mg/dL)"
              placeholderTextColor="#C83030"
              keyboardType="numeric"
              editable={true}
            />
          </View>

          <Button title="Submit" color="#C83030" onPress={handleSubmitForm} />

          <Modal visible={showSexPicker} transparent={false} animationType="slide" >
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={sex}
                onValueChange={(itemValue: string) => {
                  setSex(itemValue);
                  setShowSexPicker(false);
                }}
              >
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
              </Picker>
            </View>
          </Modal>

          <Modal visible={showCHDPicker} transparent={true} animationType="slide">
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={prevCHD}
                onValueChange={(itemValue: string) => {
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

          <Modal visible={showSmokerPicker} transparent={true} animationType="slide">
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={smoker}
                onValueChange={(itemValue: string) => {
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
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'center',
  },
  userTypeContainerWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  userTypeContainer: {
    backgroundColor: '#EEE6E6',
    borderRadius: 15,
    padding: 30,
    width: '90%',
    marginBottom: 20,
  },
  userTypeTitle: {
    color: '#C83030',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  formInput: {
    backgroundColor: 'white',
    borderColor: '#C83030',
    borderWidth: 1,
    borderRadius: 5,
    width: '48%',
    padding: 10,
    color: '#C83030',
    fontSize: 16,
  },
  pickerText: {
    color: '#C83030',
    fontSize: 16,
  },
  pickerContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#EEE6E6',
  },
});

export default AdvancedUserScreen;
