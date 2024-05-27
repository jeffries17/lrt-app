from django.urls import path
from .views import (
    home, about, generate_pdf, ultramarathon_pace_calculator, run_pace_calculator, running_snack_calculator, 
    race_improvement_calculator, training_paces_calculator, ready_for_race_day, beginner_half_marathon, beginner_marathon, 
    training_zones, running_resources, run_calorie_calculator, age_grade_calculator, run_calculators, training_plans, faster_mile,
)

urlpatterns = [
    path('', home, name='home'),
    path('about/', about, name='about'),
    path('generate_pdf/', generate_pdf, name='generate_pdf'),
    path('ultramarathon-pace-calculator/', ultramarathon_pace_calculator, name='ultramarathon_pace_calculator'),
    path('run-pace-calculator/', run_pace_calculator, name='run_pace_calculator'),
    path('running-snack-calculator/', running_snack_calculator, name='running_snack_calculator'),
    path('race-improvement-calculator/', race_improvement_calculator, name='race_improvement_calculator'),
    path('training-paces-calculator/', training_paces_calculator, name='training_paces_calculator'),
    path('ready-for-race-day/', ready_for_race_day, name='ready_for_race_day'),
    path('training-zones/', training_zones, name='training_zones'),
    path('run-calorie-calculator/', run_calorie_calculator, name='run_calorie_calculator'),
    path('age-grade-calculator/', age_grade_calculator, name='age_grade_calculator'),
    path('beginner-half-marathon/', beginner_half_marathon, name='beginner_half_marathon'),
    path('beginner-marathon/', beginner_marathon, name='beginner_marathon'),
    path('run-calculators/', run_calculators, name='run_calculators'),
    path('training-plans/', training_plans, name='training_plans'),
    path('faster-mile/', faster_mile, name='faster_mile'),
    path('running-resources/', running_resources, name='running_resources'),
]
