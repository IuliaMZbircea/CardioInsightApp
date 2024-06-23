// BasicUserScreen.js
import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, KeyboardAvoidingView, Text, SafeAreaView, TouchableOpacity, Modal } from 'react-native';
import { updateDoc, doc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore_db } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';


const BasicUserScreen = ({ route }: any) => {
  const { docId } = route.params ?? {};

  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [prevCHD, setPrevCHD] = useState('');
  const [BMI, setBMI] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [chol, setChol] = useState('120');
  const [smoker, setSmoker] = useState('');
  const [systolicBP, setSystolicBP] = useState('110');
  const [diastolicBP, setDiastolicBP] = useState('70');
  const [hr, setHR] = useState('');
  const [glucose, setGlucose] = useState('70');

  const [showSexPicker, setShowSexPicker] = useState(false);
  const [showCHDPicker, setShowCHDPicker] = useState(false);
  const [showSmokerPicker, setShowSmokerPicker] = useState(false);

  const navigation = useNavigation<any>();


  useEffect(() => {
    calculateBMI();
  }, [height, weight]);

  const calculateBMI = () => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100;
      const weightInKg = parseFloat(weight);
      const calculatedBMI = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
      setBMI(calculatedBMI);
    } else {
      setBMI('');
    }
  };

  const handleSubmitForm = async () => {
    try {
      const medicalFileRef = doc(firestore_db, 'MedicalFiles', docId);
      const userDataRef = collection(medicalFileRef, 'userData');
      
      await addDoc(userDataRef, {
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
      });

      // Clear form inputs after submission
      clearFormInputs();

      // Navigate to ProfileScreen
      navigation.navigate('ProfileScreen', {
        docId: docId,
      });
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };
  const clearFormInputs = () => {
    setAge('');
    setSex('');
    setPrevCHD('');
    setBMI('');
    setSmoker('');
    setHR('');
    setHeight('');
    setWeight('');
  };


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.userTypeContainerWrapper}>
        <View style={styles.userTypeContainer}>
          <Text style={styles.userTypeTitle}>Let's start with the basics...</Text>

          <View style={styles.formRow}>
            <View style={styles.formColumn}>
              <TextInput
                style={styles.formInput}
                value={age}
                onChangeText={(text) => setAge(text)}
                placeholder="Age"
                placeholderTextColor="#C83030"
                keyboardType="numeric"
                editable={true}
              />
            </View>

            <View style={styles.formColumn}>
            <TouchableOpacity style={styles.formInput} onPress={() => setShowSexPicker(true)}>
              <Text style={{color:'#C83030', marginTop: 10,}}>{sex || 'Gender'}</Text>
            </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formRow}>
          <View style={styles.formColumn}>
            <TouchableOpacity style={styles.formInput} onPress={() => setShowCHDPicker(true)}>
              <Text style={{color:'#C83030',marginTop: 10,}}>{prevCHD || 'Diagnosed CVD'}</Text>
            </TouchableOpacity>
            </View>
            <View style={styles.formColumn}>
              <TextInput
                style={styles.formInput}
                value={hr}
                onChangeText={(text) => setHR(text)}
                placeholder="Heart Rate (HR)"
                placeholderTextColor="#C83030"
                keyboardType="numeric"
                editable={true}
              />
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.formColumn}>
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
            <View style={styles.formColumn}>
              <TextInput
                style={styles.formInput}
                value={weight}
                onChangeText={(text) => setWeight(text)}
                placeholder="Weight (kg)"
                placeholderTextColor="#C83030"
                keyboardType="numeric"
                editable={true}
              />
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.formColumn}>
            <View style={styles.formColumn}>
            <TouchableOpacity style={styles.formInput} onPress={() => setShowSmokerPicker(true)}>
              <Text style={{color:'#C83030', marginTop: 10,}}>{smoker || 'Smoker'}</Text>
            </TouchableOpacity>
            </View>
            </View>
            <View style={styles.formColumn}>
              <TextInput
                style={styles.formInput}
                value={BMI}
                onChangeText={(text) => setBMI(text)}
                placeholder="BMI"
                placeholderTextColor="#C83030"
                keyboardType="numeric"
                editable={true}
              />
            </View>
          </View>

          <Button title="Submit" color="#C83030" onPress={handleSubmitForm} />
          <Modal visible={showSexPicker} transparent={false} animationType="slide" >
            <View style={styles.formColumn}>
              <Picker
                style={styles.pickerContainer}
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

          <Modal visible={showCHDPicker} transparent={false} animationType="slide">
            <View style={styles.formColumn}>
              <Picker
                style={styles.pickerContainer}
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

          <Modal visible={showSmokerPicker} transparent={false} animationType="slide">
            <View style={styles.formColumn}>
              <Picker
                style={styles.pickerContainer}
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
    textAlign: 'center',
    marginBottom: 20,
  },
  formInput: {
    height: 40,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 10,
    color: '#C83030',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  formRow: {
    flexDirection: 'row',
    justifyContent:'space-evenly',
    marginVertical: 10,
  },
  formColumn: {
    flex: 1,
    marginRight: 10,
  },
  pickerContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#EEE6E6',
  },
});

export default BasicUserScreen;
