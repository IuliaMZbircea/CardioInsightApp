import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { authentication } from '../../firebaseConfig';
import { RootStackParamList } from '../../App';
import Icon from 'react-native-vector-icons/Ionicons';

type SettingsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SettingsScreen'>;
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const handleLogout = () => {
    authentication.signOut().then(() => {
      navigation.replace('LoginScreen'); // Assuming LoginScreen exists in your StackNavigator
    }).catch((error) => {
      console.error('Sign out failed:', error);
      // Handle sign-out error here
    });
  };

  const handleNewMedicalRecordPress = () => {
    navigation.navigate('NewMedicalRecordScreen');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardDismissMode='on-drag'>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleNewMedicalRecordPress}>
          <Text style={styles.buttonText}>New Medical Record                        </Text>
          <Icon name="add-outline" size={24} color="#B83D37" />
        </TouchableOpacity>
      </View>

      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 30,
    backgroundColor: '#f5f5f5',
  },
  buttonContainer: {
    backgroundColor: '#EEE6E6',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#B83D37',
  },
  footerContainer: {
    marginTop: 'auto',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  logoutButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#B83D37',
  },
});

export default SettingsScreen;
