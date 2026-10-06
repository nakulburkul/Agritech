from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from .models import UserProfile, CropListing, Offer, CustomerDemand

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'get_email', 'role', 'location')
    list_filter = ('role',)
    search_fields = ('user__username', 'location')
    autocomplete_fields = ['user']

    def get_email(self, obj):
        return obj.user.email
    get_email.short_description = 'Email'

@admin.register(CropListing)
class CropListingAdmin(admin.ModelAdmin):
    list_display = ('crop_name', 'farmer', 'category', 'price_per_kg', 'stock_kg', 'is_active', 'status_indicator', 'created_at')
    list_filter = ('category', 'is_active', 'created_at')
    search_fields = ('crop_name', 'farmer__user__username')
    list_editable = ('is_active', 'price_per_kg', 'stock_kg')
    ordering = ('-created_at',)

    def status_indicator(self, obj):
        if obj.is_active and obj.stock_kg > 0:
            return mark_safe('<span style="color: #10b981; font-weight: bold;">Active</span>')
        elif not obj.is_active:
            return mark_safe('<span style="color: #ef4444; font-weight: bold;">Hidden/Ghost</span>')
        return mark_safe('<span style="color: #f59e0b; font-weight: bold;">Out of Stock</span>')
    status_indicator.short_description = 'Market Status'

@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = ('crop', 'buyer', 'farmer', 'proposed_price', 'quantity', 'total_value', 'escrow_badge', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('buyer__username', 'farmer__username', 'crop__crop_name')

    def total_value(self, obj):
        total = (obj.proposed_price or 0) * (obj.quantity or 0)
        return format_html('<b>₹{}</b>', total)
    total_value.short_description = 'Deal Value'
        
    def escrow_badge(self, obj):
        colors = {
            'Pending': '#f59e0b',
            'Countered': '#b45309',
            'Accepted': '#10b981',
            'Escrow Funded': '#8b5cf6',
            'In Transit': '#3b82f6',
            'Completed': '#059669',
            'Declined': '#ef4444',
        }
        bg_color = colors.get(obj.status, '#6b7280')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 4px 10px; border-radius: 12px; font-weight: bold; font-size: 11px;">{}</span>',
            bg_color, obj.status
        )
    escrow_badge.short_description = 'Escrow Phase'

@admin.register(CustomerDemand)
class CustomerDemandAdmin(admin.ModelAdmin):
    list_display = ('crop_name', 'buyer', 'expected_price', 'quantity', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('crop_name', 'buyer__username')
    list_editable = ('is_active',)