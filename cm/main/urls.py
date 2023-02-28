from django.urls import path
from main.views import *

urlpatterns = [
    path('', index_page, name='home'),
    path('ajax/', get_ajax, name='get_ajax'),
]