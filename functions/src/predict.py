import sys
import json
import numpy as np
from pytorch_tabnet.tab_model import TabNetClassifier

# Load models
models = {}
for target in ['ANGINA', 'STROKE', 'HYPERTEN']:
    clf = TabNetClassifier()
    clf.load_model(f'{target}_model.zip')
    models[target] = clf

# Function to predict risk
def predict_risk(data):
    # Convert string values to float
    data = {k: float(v) for k, v in data.items()}
    
    features = ['sex', 'age', 'smoker', 'prevCHD', 'chol', 'systolicBP', 'diastolicBP', 'BMI', 'hr', 'glucose']
    test_case = np.array([[data[feature] for feature in features]])
    
    predictions = {}
    for target, model in models.items():
        prediction = model.predict_proba(test_case)
        probability = prediction[0][1]  # Probability of positive class
        predictions[target] = probability
    
    max_probability = max(predictions.values())
    max_target = max(predictions, key=predictions.get)
    
    if max_probability < 0.5:
        max_target = "NO RISK"
        max_probability = None
    
    return {"predicted_disease": max_target, "probability": max_probability, "all_predictions": predictions}

if __name__ == "__main__":
    input_data = json.loads(sys.stdin.read())
    user_data = input_data['userData']
    result = predict_risk(user_data)
    print(json.dumps(result))
