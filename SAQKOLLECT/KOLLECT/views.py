import random
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import  get_user_model, authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import *

User = get_user_model()

def login_view(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']
        
        user = authenticate(request, email=email, password=password)

        if user is not None:
            login(request, user)
            messages.success(request, "Login berhasil!")
            return redirect('home')
        else:
            messages.error(request, "Username atau password salah!")
            return redirect('login')

    return render(request, 'login.html')

@login_required
def logout_view(request):
    logout(request)
    messages.success(request, "Logout berhasil!")
    return redirect('home')

def register_view(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']

        if User.objects.filter(email=email).exists():
            messages.error(request, "Email sudah digunakan!")
            return redirect('register')

        user = User.objects.create_user(email=email, password=password)
        user.save()

        request.session['temp_email'] = email

        messages.success(request, "Akun berhasil dibuat! Silakan lengkapi data Anda.")
        return redirect('finishsignup')

    return render(request, 'register.html')

def finishsignup_view(request):
    email = request.session.get('temp_email', None)
    if not email:
        messages.error(request, "Anda belum mendaftar atau sesi sudah berakhir.")
        return redirect('register')

    if request.method == 'POST':
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        phone_number = request.POST.get('phone_number')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            messages.error(request, "User  tidak ditemukan.")
            return redirect('register')

        # Update user information
        user.first_name = first_name
        user.last_name = last_name
        user.phone_number = phone_number
        user.save()

        # Clear the session variable
        request.session.pop('temp_email', None)

        messages.success(request, "Data tambahan berhasil disimpan! Silakan login.")
        return redirect('login')

    return render(request, 'finishsignup.html')

# ========== CAMPAIGN ==========

@login_required
def campaign_list(request):
    campaigns = Campaign.objects.all()
    return render(request, 'campaign_list.html', {'campaigns': campaigns})

@login_required
def campaign_detail(request, campaign_id):
    campaign = get_object_or_404(Campaign, id=campaign_id)
    return render(request, 'campaign_detail.html', {'campaign': campaign})


# ========== BOOKMARK ==========

@login_required
def add_bookmark(request, campaign_id):
    campaign = get_object_or_404(Campaign, id=campaign_id)

    # hanya KOL yg bisa bookmark
    if not request.user.is_kol:
        return HttpResponseForbidden("Hanya KOL yang bisa membuat bookmark.")

    bookmark, created = Bookmark.objects.get_or_create(
        kol=request.user,
        campaign=campaign
    )
    if created:
        messages.success(request, f"Campaign '{campaign.judul}' berhasil ditambahkan ke bookmark!")
    else:
        messages.info(request, f"Campaign '{campaign.judul}' sudah ada di bookmark Anda.")

    return redirect('campaign_detail', campaign_id=campaign.id)

@login_required
def remove_bookmark(request, campaign_id):
    campaign = get_object_or_404(Campaign, id=campaign_id)

    bookmark = Bookmark.objects.filter(kol=request.user, campaign=campaign).first()
    if bookmark:
        bookmark.delete()
        messages.success(request, f"Campaign '{campaign.judul}' berhasil dihapus dari bookmark.")
    else:
        messages.error(request, "Bookmark tidak ditemukan.")

    return redirect('campaign_detail', campaign_id=campaign.id)

@login_required
def my_bookmarks(request):
    bookmarks = Bookmark.objects.filter(kol=request.user)
    return render(request, 'my_bookmarks.html', {'bookmarks': bookmarks})
