from django.urls import path
from .views import home, ultramarathon_pace_calculator, running_snack_calculator

urlpatterns = [
    path('', home, name='home'),
    path('ultramarathon-pace-calculator/', ultramarathon_pace_calculator, name='ultramarathon_pace_calculator'),
    path('running-snack-calculator/', running_snack_calculator, name='running_snack_calculator')
]