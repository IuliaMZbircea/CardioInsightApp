// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../App';
// import { Dimensions } from 'react-native';
  
// const screenWidth = Dimensions.get('window').width;
// const screenHeight = Dimensions.get('window').height;

// type WelcomeScreenProps = {
//   navigation: NativeStackNavigationProp<RootStackParamList, 'WelcomeScreen'>;
// };

// const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
//   const handleTapToContinue = () => {
//     navigation.navigate('SignupScreen'); 
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.logoContainer}>
//         <Image source={require('../../assets/logo.png')} style={styles.logo} />
//       </View>
//       <TouchableOpacity onPress={handleTapToContinue} style={styles.tapToContinue}>
//         <Text style={styles.tapToContinueText}>Tap To Continue</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   logoContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   logo: {
//     width: screenWidth,
//     height: screenHeight,
//     resizeMode: 'contain',
//   },
//   textContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   appName: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   motto: {
//     fontSize: 16,
//     color: '#666666',
//   },
//   tapToContinue: {
//     marginBottom: 50,
//     bottom: 50,
//   },
//   tapToContinueText: {
//     fontSize: 18,
//     color: '#D68E8D', 
//   },
// });

// export default WelcomeScreen;
