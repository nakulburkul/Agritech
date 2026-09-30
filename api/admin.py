from django.contrib import admin
from .models import UserProfile, CropListing, Offer, CustomerDemand

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'location')
    list_filter = ('role',)
    search_fields = ('user__username', 'location')
    autocomplete_fields = ['user']

@admin.register(CropListing)
class CropListingAdmin(admin.ModelAdmin):
    list_display = ('crop_name', 'farmer', 'category', 'price_per_kg', 'stock_kg', 'is_active', 'created_at')
    list_filter = ('category', 'is_active', 'created_at')
    search_fields = ('crop_name', 'farmer__user__username')
    list_editable = ('is_active', 'price_per_kg', 'stock_kg')
    ordering = ('-created_at',)

@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = ('crop', 'buyer', 'farmer', 'proposed_price', 'quantity', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('buyer__username', 'farmer__username', 'crop__crop_name')

@admin.register(CustomerDemand)
class CustomerDemandAdmin(admin.ModelAdmin):
    list_display = ('crop_name', 'buyer', 'expected_price', 'quantity', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('crop_name', 'buyer__username')