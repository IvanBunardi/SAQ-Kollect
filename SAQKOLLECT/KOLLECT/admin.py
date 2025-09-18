from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *

# ============================
# Admin untuk CustomUser
# ============================
class CustomUserAdmin(UserAdmin):
    # Menyesuaikan fieldsets untuk CustomUser
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('username', 'first_name', 'last_name', 'phone_number', 'profile_picture')}),
        ('Address', {'fields': ('provinsi', 'kota_kabupaten', 'kode_pos', 'alamat_lengkap')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    # Kolom yang akan ditampilkan di list view
    list_display = ('email', 'first_name', 'last_name', 'is_staff')
    # Filter di sidebar admin
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')
    # Menambahkan pencarian berdasarkan email dan nama
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)
    # Jika username tidak ingin diedit melalui admin, bisa dijadikan read-only
    readonly_fields = ('username',)

admin.site.register(CustomUser, CustomUserAdmin)

