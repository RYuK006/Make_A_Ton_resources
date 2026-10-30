import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os, warnings

warnings.filterwarnings("ignore")

# Modified function using st.cache_data
@st.cache_data
def load_data():
    return pd.read_csv('output.csv')

data = load_data()

st.title('Scrapyard Price Analysis Tool')

# Get URL parameters using the correct method
url_brand_selected = st.query_params.brand  # Get brand from URL, default to None
url_model_selected = st.query_params.model    # Get model from URL, default to None

# Allow user to select brand and model if not specified in URL
if url_brand_selected and url_model_selected:
    brand_selected = url_brand_selected
    model_selected = url_model_selected
else:
    brand_selected = st.selectbox('Select Brand', data['brand'].unique())
    models_for_brand = data[data['brand'] == brand_selected]['model'].unique()
    model_selected = st.selectbox('Select Model', models_for_brand)

data_filtered = data[(data['brand'] == brand_selected) & (data['model'] == model_selected)]

# Function to save plots
def save_plot(fig, filename):
    os.makedirs('static/images', exist_ok=True)
    fig.savefig(f'static/images/{filename}.png', format='png')

# Plotting and saving Price vs. Age
st.header(f'Price vs. Age for {brand_selected} {model_selected}')
fig, ax = plt.subplots()
sns.scatterplot(x='age', y='price', data=data_filtered, ax=ax)
plt.title('Price Trend Over Age')
save_plot(fig, f'price_vs_age_{brand_selected}_{model_selected}')
st.pyplot(fig)

# Plotting and saving Price vs. Model
st.header(f'Price vs. Model for {brand_selected}')
same_brand_data = data[data['brand'] == brand_selected]
fig, ax = plt.subplots()
sns.boxplot(x='price', y='model', data=same_brand_data)
plt.title('Price Distribution Across Models')
save_plot(fig, f'price_vs_model_{brand_selected}')
st.pyplot(fig)

# Plotting and saving Price vs. Kilometers
st.header(f'Price vs. Kilometers for {brand_selected} {model_selected}')
fig, ax = plt.subplots()
sns.scatterplot(x='km', y='price', data=data_filtered, ax=ax)
sns.regplot(x='km', y='price', data=data_filtered, scatter=False, ax=ax, color='red', ci=None)
plt.title('Price vs. Kilometers Driven')
save_plot(fig, f'price_vs_km_{brand_selected}_{model_selected}')
st.pyplot(fig)

# Display average price
avg_price = int(round(data_filtered['price'].mean(), -3))
st.header(f'Average Selling Price for {brand_selected} {model_selected}')
st.write(f'The average selling price is: ₹{avg_price}')
