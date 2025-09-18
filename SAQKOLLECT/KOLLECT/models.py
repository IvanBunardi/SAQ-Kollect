from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """
        Membuat dan menyimpan user dengan email dan password.
        """
        if not email:
            raise ValueError('Email harus diisi')
        email = self.normalize_email(email)
        if 'username' not in extra_fields or not extra_fields['username']:
            extra_fields['username'] = email.split('@')[0]
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        """
        Membuat dan menyimpan superuser dengan email dan password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser harus memiliki is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser harus memiliki is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    provinsi = models.CharField(max_length=100, blank=True, null=True)
    kota_kabupaten = models.CharField(max_length=100, blank=True, null=True)
    kode_pos = models.CharField(max_length=10, blank=True, null=True)
    alamat_lengkap = models.TextField(blank=True, null=True)

    # Tambahan: role
    is_brand = models.BooleanField(default=False)
    is_kol = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []  

    objects = CustomUserManager()  

    def __str__(self):
        return self.email

class Campaign(models.Model):
    brand = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="campaigns")
    judul = models.CharField(max_length=255)
    deskripsi = models.TextField()
    tujuan = models.TextField(blank=True, null=True)
    platform = models.CharField(max_length=100)
    budget = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=50, default="draft")
    timeline = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.judul

class Bookmark(models.Model):
    kol = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="bookmarks")
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name="bookmarks")

    class Meta:
        unique_together = ("kol", "campaign")  # 1 KOL hanya bisa bookmark 1 campaign sekali

    def __str__(self):
        return f"{self.kol.email} → {self.campaign.judul}"
