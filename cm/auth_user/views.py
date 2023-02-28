# - Подвинуть кусок кода: Tab, Shift+Tab
# - Закомитить кусок кода: CTRL + '/'

from django.shortcuts import render, redirect

from main.models import Avatar
from .forms import CreateUserForm
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout

# Авторизация, регистрация пользователей
def register_page(request):
    if request.user.is_authenticated:
        return redirect('home')
    else:
        form = CreateUserForm()
        if request.method == 'POST':
            form = CreateUserForm(request.POST)
            if form.is_valid():
                form.save()
                user = form.cleaned_data.get('username')
                messages.success(request, f'Аккаунт {user} был успешно создан!')
                return redirect('login')

        context = {'form': form}
        return render(request, 'register.html', context)

def login_page(request):
    if request.user.is_authenticated:
        return redirect('home')
    else:
        form = CreateUserForm()
        if request.method == 'POST':
            username = request.POST.get('username')
            password = request.POST.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('home')
            else:
                messages.info(request, 'Имя пользователя либо пароль введены не верно!')

            form = CreateUserForm(request.POST)
            if form.is_valid():
                form.save()

        context = {'form': form}
        return render(request, 'login.html', context)

def log_out(request):
    logout(request)
    return redirect('login')