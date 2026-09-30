from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    ROLE_CHOICES = (
        ('FARMER', 'Farmer'),
        ('BUYER', 'Buyer'),
        ('ADMIN', 'Admin'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    location = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.user.username} - {self.role}"

class CropListing(models.Model):
    CATEGORY_CHOICES = (
        ('Vegetables', 'Vegetables'),
        ('Fruits', 'Fruits'),
        ('Grains', 'Grains'),
    )
    farmer = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='listings')
    crop_name = models.CharField(max_length=100)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    price_per_kg = models.DecimalField(max_digits=10, decimal_places=2)
    stock_kg = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.crop_name} (₹{self.price_per_kg}/kg) - {self.farmer.user.username}"

class Offer(models.Model):
    crop = models.ForeignKey(CropListing, on_delete=models.CASCADE)
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='buyer_offers')
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='farmer_offers')
    proposed_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    transport_arrangement = models.CharField(max_length=100)
    status = models.CharField(max_length=20, default='Pending') 
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Offer from {self.buyer.username} for {self.crop.crop_name}"

class CustomerDemand(models.Model):
    buyer = models.ForeignKey(User, on_delete=models.CASCADE)
    crop_name = models.CharField(max_length=100)
    expected_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Demand: {self.crop_name} by {self.buyer.username}"