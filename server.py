from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from sklearn.preprocessing import StandardScaler
from pytorch_tabnet.tab_model import TabNetClassifier
import pickle

app = Flask(__name__)
CORS(app)

# Load the models and scaler
with open('models.pkl', 'rb') as f:
    models = pickle.load(f)

scaler = StandardScaler()
# Assuming you saved your scaler, you would load it similarly:
# with open('scaler.pkl', 'rb') as f:
#     scaler = pickle.load(f)

features = ['SEX', 'AGE', 'CURSMOKE', 'PREVCHD', 'TOTCHOL', 'SYSBP', 'DIABP', 'BMI', 'HEARTRTE', 'GLUCOSE']

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    input_data = np.array([[
        data['sex'],
        data['age'],
        data['smoker'],
        data['prevCHD'],
        data['chol'],
        data['systolicBP'],
        data['diastolicBP'],
        data['BMI'],
        data['hr'],
        data['glucose']
    ]], dtype=float)

    # Standardize the input data
    input_data_scaled = scaler.transform(input_data)

    predictions = {}
    for target in models:
        clf = models[target]
        prediction = clf.predict_proba(input_data_scaled)
        probability = prediction[0][1]  # Probability of positive class
        predictions[target] = probability

    # Find the disease with the highest probability
    max_probability = max(predictions.values())
    max_target = max(predictions, key=predictions.get)

    # Check if the highest probability is under 50%
    if max_probability < 0.5:
        max_target = "NO RISK"
        max_probability = None

    return jsonify({
        'predictions': predictions,
        'predicted_disease': max_target,
        'probability': max_probability
    })

if __name__ == '__main__':
    app.run(debug=True)
