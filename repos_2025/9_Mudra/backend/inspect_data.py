import pandas as pd
import numpy as np

# Load dataset
data = pd.read_csv("dataset.csv", header=None)

print("\n===== DATASET OVERVIEW =====")
print("Shape:", data.shape)

# Separate features and labels
X = data.iloc[:, :-1]
y = data.iloc[:, -1]

print("\n===== LABEL DISTRIBUTION =====")
print(y.value_counts())

print("\n===== CHECKING FOR MISSING VALUES =====")
print("Total NaN values:", data.isnull().sum().sum())

print("\n===== FEATURE RANGE =====")
print("Minimum value:", X.min().min())
print("Maximum value:", X.max().max())

print("\n===== PER-CLASS MEAN (first 5 features only) =====")
for label in y.unique():
    class_data = X[y == label]
    print(f"\nLabel: {label}")
    print("Mean:", class_data.mean().values[:5])
    print("Std :", class_data.std().values[:5])

print("\n===== BASIC VARIANCE CHECK =====")
low_variance_features = (X.std() < 1e-3).sum()
print("Near-zero variance features:", low_variance_features)

print("\n===== SAMPLE PREVIEW =====")
print(data.head())

print("\nDataset inspection complete.")