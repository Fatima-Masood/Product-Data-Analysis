from flask import Flask, request, jsonify
import pickle
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import HashingVectorizer
from sklearn.preprocessing import StandardScaler, MinMaxScaler

app = Flask(__name__)
rf_model = None  # Placeholder for the model

# Load trained components
with open("rf_model.pkl", "wb") as f:
    pickle.dump(rf_model, f)

# Dummy initialization – replace with your trained versions if saved
hash_vectorizer_model = HashingVectorizer(n_features=10, alternate_sign=False)
hash_vectorizer_brand = HashingVectorizer(n_features=5, alternate_sign=False)
feature_scaler = StandardScaler()
target_scaler = MinMaxScaler()
original_columns = [f'col_{i}' for i in range(5 + 10 + 5)]  # replace with real column names

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # Extract features
        brand = data["brand"]
        model = data["model"]
        display_size = float(data["display_size"])
        ram = int(data["ram"])
        battery = int(data["battery"])
        storage = int(data["storage"])
        ratings = int(data["ratings"])

        # Hashing
        brand_hashed = hash_vectorizer_brand.transform([brand]).toarray()
        model_hashed = hash_vectorizer_model.transform([model]).toarray()

        # Numeric features
        input_data = pd.DataFrame([[display_size, ram, battery, storage, ratings]],
                                  columns=['Display Size', 'RAM', 'Battery', 'Internal Memory', 'Number of Ratings'])
        df_model = pd.DataFrame(model_hashed, columns=[f'model_{i}' for i in range(model_hashed.shape[1])])
        df_brand = pd.DataFrame(brand_hashed, columns=[f'brand_{i}' for i in range(brand_hashed.shape[1])])

        final_input = pd.concat([input_data, df_model, df_brand], axis=1)

        # Column order
        final_input = final_input[original_columns]

        # Scale
        final_scaled = feature_scaler.transform(final_input)

        # Predict
        scaled_price = rf_model.predict(final_scaled)
        predicted_price = target_scaler.inverse_transform(scaled_price.reshape(-1, 1)).ravel()[0]

        return jsonify({"predicted_price": round(float(predicted_price))})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Only for flask run
if __name__ == "__main__":
    app.run(debug=True, port=8000)
