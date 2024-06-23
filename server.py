from flask import Flask, request, jsonify
import pandas as pd
import pickle
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Load trained models
with open('ml_model.pkl', 'rb') as f:
    model = pickle.load(f)
    
# Load scaler from scaler.pkl
with open('scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)


@app.route('/', methods=['GET'])
def get_data():
    return jsonify({"message": "API is Running"})

# Prediction endpoint
@app.route('/predict', methods=['POST'])
def predict():

    
    data = request.get_json()

    if data is None:
        return jsonify({'error': 'No input data provided'}), 400
    
    # Prepare input data for prediction
    input_data = {
        'SEX': int(data['SEX']),
        'AGE': int(data['AGE']),
        'CURSMOKER': int(data['CURSMOKE']),
        'PREVCHD': int(data['PREVCHD']),
        'TOTCHOL': float(data['TOTCHOL']),
        'SYSBP': float(data['SYSBP']),
        'DIABP': float(data['DIABP']),
        'BMI': float(data['BMI']),
        'HEARTRTE': float(data['HEARTRTE']),
        'GLUCOSE': float(data['GLUCOSE'])
    }
    
    # Convert to DataFrame
    input_features = pd.DataFrame([input_data])
    
    scaler = pickle.load(open('scaler.pkl', 'rb'))
    input_features_scaled = scaler.transform(input_features)

    # Make predictions using the models
    predictions = {}
    for target, models in model.items():
        prediction = models.predict(input_features_scaled)
        predictions[target] = prediction[0]

    # Determine predicted disease based on highest risk
    predicted_disease = max(predictions, key=predictions.get)


    if predicted_disease == 'ANGINA':
        predicted_disease = 'Angina'    
    elif predicted_disease == 'STROKE': 
        predicted_disease = 'Stroke'
    elif predicted_disease == 'HYPERTEN':
        predicted_disease = 'Hypertension'

    return jsonify({'predicted_disease': predicted_disease})

if __name__ == '__main__':
    app.run(debug=True, port=5002)
