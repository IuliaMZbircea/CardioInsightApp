import pandas as pd

import missingno as msno
import numpy as np
from sklearn.base import accuracy_score
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
# import os
# import scipy as sc
# import json
# import seaborn as sns
# import matplotlib.pyplot as plt
# from google.colab import files
# import pytorch_tabnet
from pytorch_tabnet.tab_model import TabNetClassifier
import pickle
#import torch

#import sklearn as sk

# from sklearn.neighbors import KNeighborsClassifier
# from sklearn.ensemble import RandomForestClassifier

from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split


# from sklearn.model_selection import GridSearchCV
# from sklearn.metrics import confusion_matrix
from sklearn.metrics import accuracy_score
from sklearn.metrics import f1_score
# from sklearn.metrics import ConfusionMatrixDisplay
from sklearn.metrics import recall_score,precision_score,classification_report,roc_auc_score,roc_curve

df_fmg = pd.read_csv('Backend/frmgham2.csv')

df_fmg = df_fmg.drop(['RANDID'], axis = 1)
df_fmg = df_fmg.drop(['educ'], axis = 1)
df_fmg = df_fmg.drop(['TIMEAP'], axis = 1)
df_fmg = df_fmg.drop(['TIMEMI'], axis = 1)
df_fmg = df_fmg.drop(['TIMEMIFC'], axis = 1)
df_fmg = df_fmg.drop(['TIMECHD'], axis = 1)
df_fmg = df_fmg.drop(['TIMESTRK'], axis = 1)
df_fmg = df_fmg.drop(['TIMECVD'], axis = 1)
df_fmg = df_fmg.drop(['TIMEHYP'], axis = 1)
df_fmg = df_fmg.drop(['TIMEDTH'], axis = 1)
df_fmg = df_fmg.drop(['TIME'], axis = 1)
df_fmg = df_fmg.drop(['CIGPDAY'], axis=1)
df_fmg = df_fmg.drop(['DIABETES'], axis=1)
df_fmg = df_fmg.drop(['BPMEDS'], axis=1)
df_fmg = df_fmg.drop(['PREVAP'], axis=1)
df_fmg = df_fmg.drop(['PREVMI'], axis=1)
df_fmg = df_fmg.drop(['PREVSTRK'], axis=1)
df_fmg = df_fmg.drop(['PREVHYP'], axis=1)
df_fmg = df_fmg.drop(['PERIOD'], axis=1)
df_fmg = df_fmg.drop(['HDLC'], axis=1)
df_fmg = df_fmg.drop(['LDLC'], axis=1)
df_fmg = df_fmg.drop(['DEATH'], axis=1)
df_fmg = df_fmg.drop(['HOSPMI'], axis=1)
df_fmg = df_fmg.drop(['MI_FCHD'], axis=1)
df_fmg = df_fmg.drop(['ANYCHD'], axis=1)
df_fmg = df_fmg.drop(['CVD'], axis=1)

# Replace missing values with average
df_fmg['TOTCHOL'] = df_fmg['TOTCHOL'].fillna(df_fmg['TOTCHOL'].mean())
df_fmg['BMI'] = df_fmg['BMI'].fillna(df_fmg['BMI'].mean())
df_fmg['HEARTRTE'] = df_fmg['HEARTRTE'].fillna(df_fmg['HEARTRTE'].mean())

# Group features and targets
features = ['SEX', 'AGE', 'CURSMOKE', 'PREVCHD', 'TOTCHOL', 'SYSBP', 'DIABP', 'BMI', 'HEARTRTE', 'GLUCOSE']
targets = ['ANGINA', 'STROKE', 'HYPERTEN']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(df_fmg[features], df_fmg[targets], test_size=0.3, random_state=42)

# Standardize the features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Convert Pandas DataFrames to NumPy arrays
X_train_np = np.array(X_train_scaled)
X_test_np = np.array(X_test_scaled)
y_train_np = np.array(y_train)
y_test_np = np.array(y_test)

# Train TabNet classifier for each target variable
models={}
for i, target in enumerate(targets):
    print(f"\033[1;32mTraining TabNet for {target}\033[0m")

    # Train TabNet classifier
    clf = TabNetClassifier()
    clf.fit(X_train_np, y_train_np[:, i], eval_set=[(X_test_np, y_test_np[:, i])], patience=10, max_epochs=50)

    models[target] = clf

    # Make predictions
    y_pred = clf.predict(X_test_np)

    # Evaluate the model
    accuracy = accuracy_score(y_test_np[:, i], y_pred)
    report = classification_report(y_test_np[:, i], y_pred)

    print(f"\033[1;31mAccuracy for {target}: {accuracy}\033[0m")
    print(f"Classification Report for {target}:\n{report}")
    print("=" * 50)

    # Define the test case
test_case = np.array([[1, 37, 0, 23, 0]])

# Standardize the test case using the same scaler as used for training data
test_case_scaled = scaler.transform(test_case)

# Make predictions for each target variable
predictions = {}
for target in targets:
    clf = models[target]
    prediction = clf.predict_proba(test_case_scaled)
    probability = prediction[0][1]  # Probability of positive class
    predictions[target] = probability

# Find the disease with the highest probability
max_probability = max(predictions.values())
max_target = max(predictions, key=predictions.get)

# Check if the highest probability is under 50%
if max_probability < 0.5:
    max_target = "NO RISK"
    max_probability = None

# Print the predictions for all diseases
for target, probability in predictions.items():
    print(f"Probability of {target}:", probability)

# Print the predicted disease
print("\nPredicted disease:", max_target)
if max_probability is not None:
    print("Probability:", max_probability)
else:
    print("Probability: None")
