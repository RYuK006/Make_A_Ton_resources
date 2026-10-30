import pandas as pd

# Load full dataset
df = pd.read_csv("datasets/dataset.csv")

# Separate by label
alphabet_labels = ["A", "B", "C", "D", "E", "F"]
number_labels = ["ONE"]  # add more later
shape_labels = ["CIRCLE", "SQUARE"]

df_alphabets = df[df.iloc[:, -1].isin(alphabet_labels)]
df_numbers = df[df.iloc[:, -1].isin(number_labels)]
df_shapes = df[df.iloc[:, -1].isin(shape_labels)]

# Save separate CSVs
df_alphabets.to_csv("alphabets.csv", index=False)
df_numbers.to_csv("numbers.csv", index=False)
df_shapes.to_csv("shapes.csv", index=False)

print("Dataset split complete.")
print("Alphabets:", df_alphabets.shape)
print("Numbers:", df_numbers.shape)
print("Shapes:", df_shapes.shape)