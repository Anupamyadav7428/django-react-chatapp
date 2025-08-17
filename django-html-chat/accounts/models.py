from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):   # 👈 Ab tum apna User bana rahe ho
    # Extra fields agar chahiye to yaha add karo
    # example: phone = models.CharField(max_length=15, blank=True, null=True)
    pass
