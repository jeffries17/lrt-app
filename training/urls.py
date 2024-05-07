from django.urls import path
from .views import home, ultramarathon_pace_calculator, running_snack_calculator, race_improvement_calculator, training_paces_calculator, ready_for_race_day

urlpatterns = [
    path('', home, name='home'),
    path('ultramarathon-pace-calculator/', ultramarathon_pace_calculator, name='ultramarathon_pace_calculator'),
    path('running-snack-calculator/', running_snack_calculator, name='running_snack_calculator'),
    path('race-improvement-calculator/', race_improvement_calculator, name='race_improvement_calculator'),
    path('training-paces-calculator/', training_paces_calculator, name='training_paces_calculator'),
    path('ready-for-race-day/', ready_for_race_day, name='ready_for_race_day')
]