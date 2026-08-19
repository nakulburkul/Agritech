import os
import requests
import pandas as pd
from django.http import JsonResponse

def get_live_market_prices(request):
    # Fetch from environment variables to keep your key secure
    api_key = os.getenv("DATA_GOV_API_KEY", "YOUR_API_KEY_HERE")
    resource_id = "9ef84268-d588-465a-a308-a864a43d0070"
    
    # Get filters from the React frontend query parameters
    state = request.GET.get('state', 'Maharashtra')
    commodity = request.GET.get('commodity', None)
    
    url = f"https://api.data.gov.in/resource/{resource_id}?api-key={api_key}&format=json&limit=50&filters[state]={state}"
    
    if commodity:
        url += f"&filters[commodity]={commodity}"

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        # Load the raw records into a Pandas DataFrame for rapid manipulation
        df = pd.DataFrame(data.get('records', []))
        
        if not df.empty:
            # Ensure price columns are numeric for accurate sorting
            df['modal_price'] = pd.to_numeric(df['modal_price'], errors='coerce')
            df['min_price'] = pd.to_numeric(df['min_price'], errors='coerce')
            df['max_price'] = pd.to_numeric(df['max_price'], errors='coerce')
            
            # Sort by the most relevant pricing (highest modal price first)
            df = df.sort_values(by='modal_price', ascending=False)
            
            # Handle any missing data gracefully
            df = df.fillna(0)
            
            cleaned_data = df.to_dict(orient='records')
            return JsonResponse({"status": "success", "count": len(cleaned_data), "data": cleaned_data})
            
        return JsonResponse({"status": "success", "count": 0, "data": []})

    except requests.RequestException as e:
        return JsonResponse({"status": "error", "message": "Failed to fetch market data."}, status=500)