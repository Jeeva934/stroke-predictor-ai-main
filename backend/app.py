from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pandas as pd
import numpy as np
import joblib
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.decomposition import PCA
from sklearn.metrics import accuracy_score
import traceback

app = Flask(__name__)
CORS(app)

# Global variables
model = None
scaler = None
pca = None
features = ['gender', 'age', 'hypertension', 'heart_disease', 'ever_married',
            'work_type', 'Residence_type', 'avg_glucose_level', 'bmi', 'smoking_status']

MODEL_PATH = "stroke_model.pkl"
SCALER_PATH = "scaler.pkl"
PCA_PATH = "pca.pkl"

def train_model():
    global model, scaler, pca

    # Load your CSV file (you can replace this path later)
    df = pd.read_csv("healthcare-dataset-stroke-data.csv")

    # Remove duplicates and handle missing values
    df = df.drop_duplicates()
    df = df.dropna()

    # Label Encoding
    le = LabelEncoder()
    df['gender'] = le.fit_transform(df['gender'])
    df['smoking_status'] = le.fit_transform(df['smoking_status'])
    df['ever_married'] = le.fit_transform(df['ever_married'])
    df['work_type'] = le.fit_transform(df['work_type'])
    df['Residence_type'] = le.fit_transform(df['Residence_type'])

    # Feature/Target split
    X = df[features]
    y = df['stroke']

    # Scale
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # PCA
    pca = PCA(n_components=10)
    X_pca = pca.fit_transform(X_scaled)

    # Split and train
    X_train, X_test, y_train, y_test = train_test_split(X_pca, y, test_size=0.2, random_state=42)
    model = XGBClassifier(use_label_encoder=False, eval_metric='logloss')
    model.fit(X_train, y_train)

    # Save models
    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    joblib.dump(pca, PCA_PATH)

    # Optional: Print metrics
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model trained. Accuracy: {accuracy:.4f}")

def load_model():
    global model, scaler, pca
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    pca = joblib.load(PCA_PATH)

# Train or load
if not os.path.exists(MODEL_PATH):
    print("Training model...")
    train_model()
else:
    print("Loading existing model...")
    load_model()

# Flask API
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        # Extract input in correct order
        input_data = np.array([
            data["gender"],
            data["age"],
            data["hypertension"],
            data["heart_disease"],
            data["ever_married"],
            data["work_type"],
            data["Residence_type"],
            data["avg_glucose_level"],
            data["bmi"],
            data["smoking_status"]
        ]).reshape(1, -1)

        # Preprocess and predict
        input_scaled = scaler.transform(input_data)
        input_pca = pca.transform(input_scaled)
        prediction = model.predict(input_pca)[0]

        return jsonify({"prediction": int(prediction)})

    except Exception as e:
        print("Error:", traceback.format_exc())
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
