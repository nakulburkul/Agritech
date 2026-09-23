from django.urls import path
from . import views

urlpatterns = [
    path('smart-predict/', views.smart_predict, name='smart_predict'),
    path('market-prices/', views.get_live_market_prices, name='live_market_prices'),
]