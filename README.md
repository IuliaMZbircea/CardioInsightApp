# CardioInsight: Mobile App for Cardiovascular Health Monitoring and Risk Assessment

## Description
**CardioInsight** is a mobile app developed with React Native and Expo for monitoring cardiovascular health and risk assessment. It uses Firebase for database management and authentication and a TabNet Classifier model in Python for predicting cardiovascular diseases.

## System Requirements
- Node.js
- Expo CLI
- Firebase account
- Python 3.x
- Flask
- Libraries specified in `requirements.txt`

## Installation Steps

### Frontend (React Native + Expo)

1. **Download and Install Node.js**
2. **Install Expo CLI**:
   npm install -g expo-cli
4. **Clone the repository**:
    - git clone [(https://github.com/IuliaMZbircea/CardioInsightApp)](https://github.com/IuliaMZbircea/CardioInsightApp)
    - cd CardioInsight

5. **Install project dependencies**:
    - npm install

### Backend (Flask + Python)

1. **Install Python 3.x**
3. **Install dependencies**:
    - pip install -r requirements.txt
4. **Configure Firebase**:
    - Create a Firebase project and add the configuration to the React Native app.
    - Set up Firebase Authentication and Firestore.
## Launch Steps

### Frontend (React Native + Expo)

1. **Start the Expo app**:
    - npx expo start
2. **Scan the QR code** from the terminal with the Expo Go app to launch the app on your mobile/simulator device

### Backend (Flask + Python)

1. **Run the server**:
    python3 server.py

## Usage

1. **Register or log in** using Firebase Authentication.
2. **Choose user type and enter health data** Choose to be either a basic user or an advanced one.
3. **Receive risk assessment and Wellness Score** Go straight to Insights for a better look at your data and lifestyle recommendations for improving cardiovascular health.
4. **Add and review past entries of medical files** See the evolution of your progress.

