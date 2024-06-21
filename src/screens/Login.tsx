import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, KeyboardAvoidingView, SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { authentication } from '../../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  const handleLogin = async () => {
    setLoading(true);
    try {
        const response = await signInWithEmailAndPassword(authentication, email, password);
        navigation.navigate('Tabs', { user: response.user }); // Pass user object to ProfileScreen
    } catch (error: any) {
        console.error('Sign in failed:', error);
        alert('Sign in failed: ' + error.message);
    } finally {
        setLoading(false);
    }
};


  const handleSignupRedirect = () => {
    navigation.navigate('SignupScreen');
    console.log('Navigated to Signup page.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.userTypeContainerWrapper}>
        <View style={styles.userTypeContainer}>
          <Text style={styles.userTypeTitle}>Login</Text>
          <TextInput
            style={styles.input}
            value={email}
            placeholder="Email address"
            autoCapitalize='none'
            onChangeText={setEmail}
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            autoCapitalize='none'
            onChangeText={setPassword}
            placeholderTextColor="#aaa"
          />

          {loading ? (
            <ActivityIndicator size="large" color="rgba(200, 48, 48, 0.6)" />
          ) : (
            <>
              <TouchableOpacity style={styles.loginButton}>
                <Button title="Login" onPress={handleLogin} disabled={loading} />
              </TouchableOpacity>
              <Text style={styles.footer}>
                Not registered yet?
                <TouchableOpacity onPress={handleSignupRedirect}>
                  <Text style={{ color: 'rgba(200, 48, 48, 0.6)', fontWeight: 'bold' }}> Create an account</Text>
                </TouchableOpacity>
              </Text>
            </>
          )}

          <View style={styles.separatorContainer}>
            <View style={styles.separator}></View>
          </View>
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
  input: {
    height: 40,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
    color: '#C83030',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  footer: {
    marginTop: 20,
    textAlign: 'left',
    color: 'rgba(200, 48, 48, 0.6)',
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
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 20,
  },
  loginButton: {
    height: 40,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    marginTop: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#F5CCCD',
    flex: 1,
    marginLeft: 1,
    marginRight: 1,
  },
});

export default LoginScreen;
