import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { authentication } from '../../firebaseConfig';
import { RootStackParamList } from '../../App';

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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  logoutButton: {
    backgroundColor: '#B83D37',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  logoutButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default SettingsScreen;
