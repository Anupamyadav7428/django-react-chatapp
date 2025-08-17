from django.urls import path
from .views import register, MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', register, name='register'),
    path("login/", MyTokenObtainPairView.as_view(), name="login"),   # 👈 JWT login
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
