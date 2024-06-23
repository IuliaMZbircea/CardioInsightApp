# CardioInsight: Mobile App for Cardiovascular Health Monitoring and Risk Assessment

## Description
**CardioInsight** is a mobile app developed with React Native and Expo for monitoring cardiovascular health and risk assessment. It uses Firebase for database management and authentication, and a TabNet Classifier model in Python for predicting cardiovascular diseases.

## System Requirements
- Node.js
- Expo CLI
- Firebase account
- Python 3.x
- Flask
- Libraries specified in `requirements.txt`

## Installation Steps

### Frontend (React Native + Expo)

1. **Install Node.js**: [Node.js Download](https://nodejs.org/)
2. **Install Expo CLI**: npm install -g expo-cli
3. **Clone the repository**:

    git clone https://github.com/username/CardioInsight.git
    cd CardioInsight/frontend

4. **Install project dependencies**:
    ```sh
    npm install
    ```

### Backend (Flask + Python)

1. **Install Python 3.x**: [Python Download](https://www.python.org/downloads/)
2. **Create and activate a virtual environment**:
    ```sh
    python -m venv venv
    source venv/bin/activate  # For Windows: venv\Scripts\activate
    ```
3. **Install dependencies**:
    ```sh
    pip install -r requirements.txt
    ```
4. **Configure Firebase**:
    - Create a Firebase project and add the configuration to the React Native app.
    - Set up Firebase Authentication and Realtime Database or Firestore.

## Launch Steps

### Frontend (React Native + Expo)

1. **Start the Expo app**:
    ```sh
    expo start
    ```
2. **Scan the QR code** from the terminal with the Expo Go app to launch the app on your mobile device.

### Backend (Flask + Python)

1. **Run the Flask server**:
    ```sh
    cd backend
    flask run
    ```
2. **Ensure the Flask server is accessible to the mobile app.** Use a tunneling service like ngrok to make the local server accessible via a public URL:
    ```sh
    ngrok http 5000
    ```

## Usage

1. **Register or log in** using Firebase Authentication.
2. **Enter health data** in the mobile app.
3. **Receive risk assessment** based on the TabNet model implemented in the backend.

## Contribution

1. **Clone the repository**:
    ```sh
    git clone https://github.com/username/CardioInsight.git
    cd CardioInsight
    ```
2. **Create a new branch**:
    ```sh
    git checkout -b feature/your-feature
    ```
3. **Make your changes** and commit:
    ```sh
    git commit -m "Add your message"
    ```
4. **Push your changes**:
    ```sh
    git push origin feature/your-feature
    ```

5. **Open a Pull Request** on GitHub.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
For questions or suggestions, please contact me at [email@example.com](mailto:email@example.com).
