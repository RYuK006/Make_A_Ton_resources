import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

# =========================
# Load dataset
# =========================
df = pd.read_csv("shapes.csv")

# Separate features and label
X_raw = df.iloc[:, :-1].values
y_raw = df.iloc[:, -1].values

# =========================
# Feature Extraction
# =========================
def extract_features(sample):
    """
    sample shape: (1800,)
    reshape -> (300, 6)
    """
    sample = sample.reshape(-1, 6)

    features = []

    for i in range(6):
        axis = sample[:, i]

        features.append(np.mean(axis))
        features.append(np.std(axis))
        features.append(np.min(axis))
        features.append(np.max(axis))
        features.append(np.ptp(axis))          # peak-to-peak
        features.append(np.sum(axis**2))       # energy

    return features

X = np.array([extract_features(sample) for sample in X_raw])

print("Original shape:", X_raw.shape)
print("Feature shape :", X.shape)

# =========================
# Encode labels
# =========================
le = LabelEncoder()
y = le.fit_transform(y_raw)

# =========================
# Scaling for cross-validation
# =========================
scaler_full = StandardScaler()
X_scaled_full = scaler_full.fit_transform(X)

# =========================
# Cross Validation
# =========================
model_cv = RandomForestClassifier(n_estimators=200, random_state=42)
scores = cross_val_score(model_cv, X_scaled_full, y, cv=5)

print("\n===== CROSS VALIDATION =====")
print("Fold scores:", scores)
print("Mean accuracy:", scores.mean())

# =========================
# Train/Test Split
# =========================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42, stratify=y
)

# =========================
# Scaling
# =========================
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# =========================
# Model
# =========================
model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train, y_train)

# =========================
# Evaluation
# =========================
y_pred = model.predict(X_test)

print("\nAccuracy:", accuracy_score(y_test, y_pred))
print("\nConfusion Matrix:\n", confusion_matrix(y_test, y_pred))
print("\nClassification Report:\n")
print(classification_report(y_test, y_pred))

# =========================
# Save everything
# =========================
import joblib
joblib.dump(model, "shapes_features.pkl")
joblib.dump(scaler, "scaler_shapes.pkl")
joblib.dump(le, "label_encoder_shapes.pkl")

print("\nFeature-based model saved.")