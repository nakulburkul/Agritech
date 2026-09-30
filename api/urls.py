from django.urls import path
from . import views

urlpatterns = [
    path('smart-predict/', views.smart_predict, name='smart_predict'),
    path('market-prices/', views.get_live_market_prices, name='live_market_prices'),
    path('login/', views.api_login, name='api_login'),
    path('register/', views.api_register, name='api_register'),
    path('offers/', views.handle_offers, name='handle_offers'),
    path('demands/', views.handle_demands, name='handle_demands'),
    path('listings/', views.get_direct_listings, name='get_direct_listings'),
    path('inventory/', views.manage_inventory, name='manage_inventory'), # Added route
]