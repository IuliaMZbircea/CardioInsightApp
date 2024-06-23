import React, { useState } from 'react';
import { View, TextInput, Alert, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, SafeAreaView, Platform, ActivityIndicator } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { authentication, firestore_db } from '../../firebaseConfig';
import { setDoc, doc } from 'firebase/firestore';

const SignupScreen = () => {
    const navigation = useNavigation<any>();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLoginRedirect = () => {
        navigation.navigate('LoginScreen');
    }

    const handleSignup = async () => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(authentication, email, password);
    
            const newUser = {
                uid: userCredential.user.uid,
                email: email,
                name: name,
                createdAt: new Date().toISOString(),
                hasSelectedUserType: false,
            };
    
            await setDoc(doc(firestore_db, "MedicalFiles", userCredential.user.uid), newUser);
            navigation.navigate('UserTypeSelectionScreen', { user: newUser });
        } catch (error: any) {
            console.error('Error signing up:', error.message);
            Alert.alert("Sign up failed", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.userTypeContainerWrapper}>
                <View style={styles.userTypeContainer}>
                    <Text style={styles.userTypeTitle}>Sign Up</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        placeholderTextColor="#aaa"
                        value={name}
                        autoCapitalize='none'
                        onChangeText={(text) => setName(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email address"
                        placeholderTextColor="#aaa"
                        value={email}
                        autoCapitalize='none'
                        onChangeText={(text) => setEmail(text)}
                    />
                    <TextInput
                        style={styles.input}
                        value={password}
                        placeholder="Password"
                        secureTextEntry={true}
                        autoCapitalize='none'
                        onChangeText={(text) => setPassword(text)}
                        placeholderTextColor="#aaa"
                    />
                    <TouchableOpacity style={styles.loginButton} onPress={handleSignup} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator size="small" color="#C83030" />
                        ) : (
                            <Text style={{ color: '#C83030', fontSize: 16 }}>Sign Up</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.separatorContainer}>
                        <View style={styles.separator}></View>
                    </View>
                    <Text style={styles.footer}>
                        Already have an account?
                        <TouchableOpacity onPress={handleLoginRedirect}>
                            <Text style={{ color: `rgba(200, 48, 48, 0.6)`, fontWeight: 'bold' }}> Log In</Text>
                        </TouchableOpacity>
                    </Text>
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
    footer: {
        marginTop: 20,
        textAlign: 'left',
        color: 'rgba(200, 48, 48, 0.6)',
    },
});

export default SignupScreen;
