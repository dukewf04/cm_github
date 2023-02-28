from django.urls import path
from auth_user.views import *

urlpatterns = [
    path('register/', register_page, name='register'),
    path('login/', login_page, name='login'),
    path('logout/', log_out, name='logout'),
]