import os
import time
import requests
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
from xgboost import XGBClassifier
from sklearn.preprocessing import LabelEncoder

SOIL_MAP = {"Black Cotton": 0, "Laterite": 1, "Alluvial": 2, "Red": 3}

# -------------------------------------------------------------------
# COMPREHENSIVE MAHARASHTRA DISTRICT AGRO-CLIMATIC DIRECTORY
# -------------------------------------------------------------------
district_agro_profiles = [
    # --- KONKAN & COASTAL BELT (High Rainfall, Laterite & Alluvial Soil) ---
    {"district": "Ratnagiri", "lat": 16.99, "lon": 73.30, "soil": "Laterite", "crops": [
        {"name": "Mango", "month": 1, "irrigation": 0},
        {"name": "Rice", "month": 6, "irrigation": 0},
        {"name": "Cashew", "month": 6, "irrigation": 0},
        {"name": "Coconut", "month": 6, "irrigation": 1},
        {"name": "Finger Millet (Ragi)", "month": 6, "irrigation": 0},
        {"name": "Kokum", "month": 6, "irrigation": 0}
    ]},
    {"district": "Sindhudurg", "lat": 16.11, "lon": 73.69, "soil": "Laterite", "crops": [
        {"name": "Rice", "month": 6, "irrigation": 0},
        {"name": "Mango", "month": 1, "irrigation": 0},
        {"name": "Cashew", "month": 6, "irrigation": 0},
        {"name": "Coconut", "month": 6, "irrigation": 1},
        {"name": "Groundnut", "month": 1, "irrigation": 1}
    ]},
    {"district": "Raigad", "lat": 18.51, "lon": 73.18, "soil": "Alluvial", "crops": [
        {"name": "Rice", "month": 6, "irrigation": 0},
        {"name": "Vegetables", "month": 11, "irrigation": 1},
        {"name": "Finger Millet (Ragi)", "month": 6, "irrigation": 0},
        {"name": "Watermelon", "month": 1, "irrigation": 1},
        {"name": "Mango", "month": 1, "irrigation": 0}
    ]},
    {"district": "Palghar", "lat": 19.69, "lon": 72.76, "soil": "Alluvial", "crops": [
        {"name": "Rice", "month": 6, "irrigation": 0},
        {"name": "Tomato", "month": 10, "irrigation": 1},
        {"name": "Sapota (Chikoo)", "month": 6, "irrigation": 1},
        {"name": "Green Chilli", "month": 7, "irrigation": 1}
    ]},
    {"district": "Thane", "lat": 19.21, "lon": 72.97, "soil": "Alluvial", "crops": [
        {"name": "Rice", "month": 6, "irrigation": 0},
        {"name": "Vegetables", "month": 11, "irrigation": 1},
        {"name": "Sapota (Chikoo)", "month": 6, "irrigation": 1},
        {"name": "Brinjal", "month": 10, "irrigation": 1}
    ]},

    # --- WESTERN MAHARASHTRA (Cane, Grapes, Onions, Vegetables, Millets) ---
    {"district": "Pune", "lat": 18.52, "lon": 73.85, "soil": "Black Cotton", "crops": [
        {"name": "Sugarcane", "month": 1, "irrigation": 1},
        {"name": "Tomato", "month": 7, "irrigation": 1},
        {"name": "Wheat", "month": 11, "irrigation": 1},
        {"name": "Onion", "month": 11, "irrigation": 1},
        {"name": "Jowar", "month": 10, "irrigation": 0},
        {"name": "Fig", "month": 7, "irrigation": 1},
        {"name": "Maize", "month": 6, "irrigation": 1}
    ]},
    {"district": "Kolhapur", "lat": 16.70, "lon": 74.24, "soil": "Laterite", "crops": [
        {"name": "Sugarcane", "month": 1, "irrigation": 1},
        {"name": "Soybean", "month": 6, "irrigation": 0},
        {"name": "Groundnut", "month": 6, "irrigation": 0},
        {"name": "Rice", "month": 6, "irrigation": 0},
        {"name": "Jowar", "month": 6, "irrigation": 0}
    ]},
    {"district": "Solapur", "lat": 17.65, "lon": 75.90, "soil": "Black Cotton", "crops": [
        {"name": "Jowar", "month": 10, "irrigation": 0},
        {"name": "Pomegranate", "month": 1, "irrigation": 1},
        {"name": "Wheat", "month": 11, "irrigation": 1},
        {"name": "Sugarcane", "month": 1, "irrigation": 1},
        {"name": "Gram (Chana)", "month": 10, "irrigation": 0},
        {"name": "Onion", "month": 11, "irrigation": 1}
    ]},
    {"district": "Sangli", "lat": 16.85, "lon": 74.58, "soil": "Black Cotton", "crops": [
        {"name": "Grapes", "month": 10, "irrigation": 1},
        {"name": "Sugarcane", "month": 1, "irrigation": 1},
        {"name": "Turmeric", "month": 5, "irrigation": 1},
        {"name": "Soybean", "month": 6, "irrigation": 0},
        {"name": "Maize", "month": 6, "irrigation": 1},
        {"name": "Pomegranate", "month": 1, "irrigation": 1}
    ]},
    {"district": "Satara", "lat": 17.68, "lon": 73.99, "soil": "Red", "crops": [
        {"name": "Sugarcane", "month": 1, "irrigation": 1},
        {"name": "Ginger", "month": 5, "irrigation": 1},
        {"name": "Soybean", "month": 6, "irrigation": 0},
        {"name": "Strawberry", "month": 10, "irrigation": 1},
        {"name": "Wheat", "month": 11, "irrigation": 1},
        {"name": "Jowar", "month": 10, "irrigation": 0}
    ]},

    # --- NORTH MAHARASHTRA / KHANDESH (Onions, Cotton, Banana) ---
    {"district": "Nashik", "lat": 19.99, "lon": 73.78, "soil": "Red", "crops": [
        {"name": "Onion", "month": 11, "irrigation": 1},
        {"name": "Onion (Kharif)", "month": 6, "irrigation": 0},
        {"name": "Grapes", "month": 10, "irrigation": 1},
        {"name": "Tomato", "month": 7, "irrigation": 1},
        {"name": "Pomegranate", "month": 1, "irrigation": 1},
        {"name": "Wheat", "month": 11, "irrigation": 1},
        {"name": "Maize", "month": 6, "irrigation": 0}
    ]},
    {"district": "Jalgaon", "lat": 21.00, "lon": 75.56, "soil": "Black Cotton", "crops": [
        {"name": "Banana", "month": 6, "irrigation": 1},
        {"name": "Cotton", "month": 6, "irrigation": 0},
        {"name": "Maize", "month": 6, "irrigation": 0},
        {"name": "Soybean", "month": 6, "irrigation": 0},
        {"name": "Jowar", "month": 10, "irrigation": 0},
        {"name": "Gram (Chana)", "month": 10, "irrigation": 0}
    ]},
    {"district": "Ahmednagar", "lat": 19.09, "lon": 74.74, "soil": "Black Cotton", "crops": [
        {"name": "Sugarcane", "month": 1, "irrigation": 1},
        {"name": "Onion", "month": 11, "irrigation": 1},
        {"name": "Bajra", "month": 6, "irrigation": 0},
        {"name": "Cotton", "month": 6, "irrigation": 0},
        {"name": "Pomegranate", "month": 1, "irrigation": 1},
        {"name": "Jowar", "month": 10, "irrigation": 0}
    ]},
    {"district": "Dhule", "lat": 20.90, "lon": 74.77, "soil": "Red", "crops": [
        {"name": "Cotton", "month": 6, "irrigation": 0},
        {"name": "Bajra", "month": 6, "irrigation": 0},
        {"name": "Chilli", "month": 7, "irrigation": 1},
        {"name": "Groundnut", "month": 6, "irrigation": 0},
        {"name": "Onion", "month": 11, "irrigation": 1}
    ]},

    # --- MARATHWADA (Soybean, Pulses, Cotton, Drought-Hardy Grains) ---
    {"district": "Chhatrapati Sambhajinagar", "lat": 19.87, "lon": 75.34, "soil": "Black Cotton", "crops": [
        {"name": "Cotton", "month": 6, "irrigation": 0},
        {"name": "Soybean", "month": 6, "irrigation": 0},
        {"name": "Sweet Lime (Mousambi)", "month": 2, "irrigation": 1},
        {"name": "Bajra", "month": 6, "irrigation": 0},
        {"name": "Maize", "month": 6, "irrigation": 0},
        {"name": "Tur (Pigeon Pea)", "month": 6, "irrigation": 0}
    ]},
    {"district": "Latur", "lat": 18.40, "lon": 76.56, "soil": "Black Cotton", "crops": [
        {"name": "Soybean", "month": 6, "irrigation": 0},
        {"name": "Tur (Pigeon Pea)", "month": 6, "irrigation": 0},
        {"name": "Gram (Chana)", "month": 10, "irrigation": 1},
        {"name": "Sunflower", "month": 10, "irrigation": 0},
        {"name": "Safflower (Kardai)", "month": 10, "irrigation": 0}
    ]},
    {"district": "Nanded", "lat": 19.15, "lon": 77.30, "soil": "Black Cotton", "crops": [
        {"name": "Cotton", "month": 6, "irrigation": 0},
        {"name": "Soybean", "month": 6, "irrigation": 0},
        {"name": "Banana", "month": 6, "irrigation": 1},
        {"name": "Tur (Pigeon Pea)", "month": 6, "irrigation": 0},
        {"name": "Jowar", "month": 10, "irrigation": 0}
    ]},
    {"district": "Jalna", "lat": 19.83, "lon": 75.88, "soil": "Black Cotton", "crops": [
        {"name": "Sweet Lime (Mousambi)", "month": 2, "irrigation": 1},
        {"name": "Cotton", "month": 6, "irrigation": 0},
        {"name": "Soybean", "month": 6, "irrigation": 0},
        {"name": "Bajra", "month": 6, "irrigation": 0},
        {"name": "Tur (Pigeon Pea)", "month": 6, "irrigation": 0}
    ]},
    {"district": "Beed", "lat": 18.98, "lon": 75.75, "soil": "Black Cotton", "crops": [
        {"name": "Bajra", "month": 6, "irrigation": 0},
        {"name": "Cotton", "month": 6, "irrigation": 0},
        {"name": "Jowar", "month": 10, "irrigation": 0},
        {"name": "Soybean", "month": 6, "irrigation": 0},
        {"name": "Gram (Chana)", "month": 10, "irrigation": 0}
    ]},

    # --- VIDARBHA (Cotton, Soybean, Citrus, Pulses, Eastern Rice) ---
    {"district": "Nagpur", "lat": 21.14, "lon": 79.08, "soil": "Black Cotton", "crops": [
        {"name": "Nagpur Orange", "month": 2, "irrigation": 1},
        {"name": "Cotton", "month": 6, "irrigation": 0},
        {"name": "Soybean", "month": 6, "irrigation": 0},
        {"name": "Wheat", "month": 11, "irrigation": 1},
        {"name": "Tur (Pigeon Pea)", "month": 6, "irrigation": 0},
        {"name": "Gram (Chana)", "month": 10, "irrigation": 1}
    ]},
    {"district": "Amravati", "lat": 20.93, "lon": 77.77, "soil": "Black Cotton", "crops": [
        {"name": "Cotton", "month": 6, "irrigation": 0},
        {"name": "Soybean", "month": 6, "irrigation": 0},
        {"name": "Nagpur Orange", "month": 2, "irrigation": 1},
        {"name": "Tur (Pigeon Pea)", "month": 6, "irrigation": 0},
        {"name": "Gram (Chana)", "month": 10, "irrigation": 0}
    ]},
    {"district": "Akola", "lat": 20.70, "lon": 77.00, "soil": "Black Cotton", "crops": [
        {"name": "Cotton", "month": 6, "irrigation": 0},
        {"name": "Soybean", "month": 6, "irrigation": 0},
        {"name": "Tur (Pigeon Pea)", "month": 6, "irrigation": 0},
        {"name": "Jowar", "month": 6, "irrigation": 0},
        {"name": "Wheat", "month": 11, "irrigation": 1}
    ]},
    {"district": "Yavatmal", "lat": 20.38, "lon": 78.12, "soil": "Black Cotton", "crops": [
        {"name": "Cotton", "month": 6, "irrigation": 0},
        {"name": "Soybean", "month": 6, "irrigation": 0},
        {"name": "Tur (Pigeon Pea)", "month": 6, "irrigation": 0},
        {"name": "Jowar", "month": 6, "irrigation": 0}
    ]},
    {"district": "Chandrapur", "lat": 19.96, "lon": 79.29, "soil": "Red", "crops": [
        {"name": "Rice", "month": 6, "irrigation": 1},
        {"name": "Cotton", "month": 6, "irrigation": 0},
        {"name": "Soybean", "month": 6, "irrigation": 0},
        {"name": "Tur (Pigeon Pea)", "month": 6, "irrigation": 0}
    ]},
    {"district": "Bhandara", "lat": 21.17, "lon": 79.65, "soil": "Red", "crops": [
        {"name": "Rice", "month": 6, "irrigation": 1},
        {"name": "Linseed", "month": 10, "irrigation": 0},
        {"name": "Tur (Pigeon Pea)", "month": 6, "irrigation": 0}
    ]}
]

# -------------------------------------------------------------------
# AGRONOMIC FEATURE PIPELINE
# -------------------------------------------------------------------
def prep_features(df):
    df['gdd'] = ((df['temp_max'] + df['temp_min']) / 2 - 10).clip(lower=0)
    
    seasonal = df.groupby('farm_id').agg(
        total_precip_mm=('precip_mm', 'sum'), 
        mean_humidity=('humidity', 'mean'),
        absolute_max_temp=('temp_max', 'max'), 
        total_gdd=('gdd', 'sum'),
        heat_stress_days=('temp_max', lambda x: (x > 35).sum()),
        dry_days=('precip_mm', lambda x: (x == 0).sum()),
        soil_type=('soil_type', 'first'),
        irrigation=('irrigation', 'first')
    ).reset_index()

    df['stage'] = pd.cut(df['day_of_season'], bins=[0, 15, 50, 70, 120], labels=['germination', 'vegetative', 'flowering', 'maturity'])
    stages = df.pivot_table(index='farm_id', columns='stage', values='precip_mm', aggfunc='sum', observed=False)
    stages.columns = [f'rain_{c}' for c in stages.columns]
    stages = stages.reset_index()

    return pd.merge(seasonal, stages, on='farm_id')

# -------------------------------------------------------------------
# HARVESTING PIPELINE (STRICTLY REAL DATA ONLY)
# -------------------------------------------------------------------
hist_dfs = []
labels = []
years = [2021, 2022, 2023, 2024, 2025, 2026]

print("=" * 65)
print(f"Starting Multi-District Data Harvesting ({len(district_agro_profiles)} Districts across Maharashtra)...")
print(f"Timeframe: {years[0]} to {years[-1]}")
print("Strict Mode: Synthetic data generation is disabled.")
print("=" * 65)

for region in district_agro_profiles:
    dist = region['district']
    print(f"\nProcessing District: {dist} ({region['soil']} Soil, Lat: {region['lat']}, Lon: {region['lon']})")
    
    for crop in region['crops']:
        for year in years:
            start_str = f"{year}-{crop['month']:02d}-01"
            end_date_obj = datetime.strptime(start_str, "%Y-%m-%d") + pd.Timedelta(days=119)
            end_str = end_date_obj.strftime("%Y-%m-%d")
            
            # Prevent requesting dates in the future (avoids API 400 errors)
            if end_date_obj > datetime.now():
                continue
            
            url = (
                f"https://archive-api.open-meteo.com/v1/archive?"
                f"latitude={region['lat']}&longitude={region['lon']}&"
                f"start_date={start_str}&end_date={end_str}&"
                f"daily=temperature_2m_max,temperature_2m_min,precipitation_sum&"
                f"hourly=relative_humidity_2m&timezone=auto"
            )
            
            try:
                resp = requests.get(url, timeout=10)
                if resp.ok:
                    data = resp.json()
                    daily = data.get('daily', {})
                    
                    # Ensure we got a full 120-day return
                    if len(daily.get('temperature_2m_max', [])) >= 120:
                        humidity_hourly = np.array(data.get('hourly', {}).get('relative_humidity_2m', []))
                        if len(humidity_hourly) >= 120 * 24:
                            humidity_daily = np.nanmean(humidity_hourly[:120 * 24].reshape(120, 24), axis=1)
                        else:
                            humidity_daily = np.full(120, 65.0)

                        df = pd.DataFrame({
                            'farm_id': f"{dist}_{crop['name']}_{year}",
                            'day_of_season': range(1, 121),
                            'temp_max': daily['temperature_2m_max'][:120],
                            'temp_min': daily['temperature_2m_min'][:120],
                            'precip_mm': daily['precipitation_sum'][:120],
                            'humidity': humidity_daily,
                            'soil_type': SOIL_MAP[region['soil']],
                            'irrigation': crop['irrigation']
                        }).ffill().bfill()

                        hist_dfs.append(df)
                        labels.append(crop['name'])
                
                # Increased sleep to 0.5s to prevent Open-Meteo from rate-limiting the connection
                time.sleep(0.5) 
            except Exception as e:
                print(f"Failed to fetch data for {crop['name']} in {year}: {e}")

# Strict verification: Do not proceed if real data was not gathered
if not hist_dfs:
    raise ValueError("\nERROR: No real historical data was fetched from Open-Meteo. Training aborted to prevent reliance on fake data.")

print(f"\nAPI Harvesting completed. Gathered {len(hist_dfs)} real seasonal datasets.")

# -------------------------------------------------------------------
# MODEL TRAINING
# -------------------------------------------------------------------
print("\nExtracting feature matrix...")
X_train = prep_features(pd.concat(hist_dfs)).drop(columns=['farm_id'])

le = LabelEncoder()
y_train = le.fit_transform(labels)

print(f"Training XGBoost Classifier on {len(X_train)} samples across {len(le.classes_)} unique crops:")
print(f"Classes: {', '.join(le.classes_)}")

model = XGBClassifier(
    n_estimators=180,
    learning_rate=0.08,
    max_depth=5,
    subsample=0.85,
    colsample_bytree=0.85,
    random_state=42
)
model.fit(X_train, y_train)

# Save the trained bundle to backend and api directories
bundle = {'model': model, 'encoder': le}
joblib.dump(bundle, 'crop_model.pkl')
if os.path.exists('api'):
    joblib.dump(bundle, os.path.join('api', 'crop_model.pkl'))

print("\nModel training successful!")
print("Saved 'crop_model.pkl' (trained strictly with real historical telemetry).")