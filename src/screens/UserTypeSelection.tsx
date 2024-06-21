import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { updateDoc, doc } from 'firebase/firestore';
import { firestore_db, authentication } from '../../firebaseConfig';

const UserTypeSelectionScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const handleUserTypeSelection = async (userType: string) => {
    try {
      const currentUser = authentication.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const userDocRef = doc(firestore_db, 'MedicalFiles', currentUser.uid);
      await updateDoc(userDocRef, {
        userType: userType,
        hasSelectedUserType: true,  // Update this field
      });

      if (userType === 'advanced') {
        navigation.navigate('AdvancedUserScreen', { docId: userDocRef.id });
      } else {
        navigation.navigate('ProfileScreen', { docId: userDocRef.id });
      }
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const UserTypeContainer = ({ title, description, userType }: any) => (
    <TouchableWithoutFeedback onPress={() => handleUserTypeSelection(userType)}>
      <View style={styles.userTypeContainer}>
        <Text style={styles.userTypeTitle}>{title}</Text>
        <Text style={styles.userTypeDescription}>{description}</Text>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userTypeContainerWrapper}>
        <UserTypeContainer
          title="Basic User"
          description={`\u2022 Personalized predictions based on key indicators\n\u2022 Quick and easy registration\n\u2022 Essential health data input\n\u2022 Fast access to personalized insights\n\u2022 Less accurate predictions`}
          userType="basic"
        />
      </View>

      <View style={styles.separatorContainer}>
        <View style={styles.separator}></View>
        <Text style={styles.separatorText}>or</Text>
        <View style={styles.separator}></View>
      </View>

      <View style={styles.userTypeContainerWrapper}>
        <UserTypeContainer
          title="Advanced User"
          description={`\u2022 Detailed input for accurate predictions\n\u2022 Tailored recommendations based on comprehensive health data\n\u2022 Fine-tune your heart health strategy`}
          userType="advanced"
        />
      </View>
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
    width: '80%',
    marginBottom: 20,
  },
  userTypeTitle: {
    color: '#C83030',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 10,
  },
  userTypeDescription: {
    color: '#C83030',
    fontSize: 16,
    textAlign: 'left',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#F5CCCD',
    flex: 1,
    marginBottom: 30,
  },
  separatorText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: 'rgba(200, 48, 48, 0.6)',
    marginBottom: 30,
  },
});

export default UserTypeSelectionScreen;
