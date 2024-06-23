import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from pytorch_tabnet.tab_model import TabNetClassifier
import pickle
from sklearn.metrics import accuracy_score, classification_report
from sklearn.impute import SimpleImputer

# Load data
df_fmg = pd.read_csv('./Backend/frmgham2.csv')
print(df_fmg.head())

# Dropping unnecessary columns
columns_to_drop = ['RANDID', 'educ', 'TIMEAP', 'TIMEMI', 'TIMEMIFC', 'TIMECHD', 'TIMESTRK',
                   'TIMECVD', 'TIMEHYP', 'TIMEDTH', 'TIME', 'CIGPDAY', 'DIABETES', 'BPMEDS',
                   'PREVAP', 'PREVMI', 'PREVSTRK', 'PREVHYP', 'PERIOD', 'HDLC', 'LDLC',
                   'DEATH', 'HOSPMI', 'MI_FCHD', 'ANYCHD', 'CVD']
df_fmg = df_fmg.drop(columns_to_drop, axis=1)
print(df_fmg.head())


# Replace missing values with average
imputer = SimpleImputer(strategy='mean')

# Define features and targets
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

X_train_np = imputer.fit_transform(X_train_np)
X_test_np = imputer.transform(X_test_np)


model = {}

for i, target in enumerate(targets):
    print(f"Training TabNet for {target}")

    # Initialize TabNet classifier
    clf = TabNetClassifier()
    clf.fit(X_train_np, y_train_np[:, i], eval_set=[(X_test_np, y_test_np[:, i])], patience=100, max_epochs=200)

    # Save the trained model to models dictionary
    model[target] = clf

    # Make predictions on test set
    y_pred = clf.predict(X_test_np)

    # Evaluate the model
    accuracy = accuracy_score(y_test_np[:, i], y_pred)
    report = classification_report(y_test_np[:, i], y_pred)

    print(f"Accuracy for {target}: {accuracy}")
    print(f"Classification Report for {target}:\n{report}")
    print("=" * 50)

# Save models dictionary to models.pkl
with open('ml_model.pkl', 'wb') as f:
    pickle.dump(model, f)

# Save scaler to scaler.pkl
with open('scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f, protocol=pickle.HIGHEST_PROTOCOL)


print("Models saved successfully.")
