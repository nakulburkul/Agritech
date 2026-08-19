from django.urls import path
from . import views

urlpatterns = [
    path('mandi-prices/', views.get_live_market_prices, name='mandi-prices'),
]