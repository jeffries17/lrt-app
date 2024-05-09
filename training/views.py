from django.shortcuts import render

def home(request):
    return render(request, 'home.html')

def ultramarathon_pace_calculator(request):
    return render(request, 'calculators/ultramarathon_pace_calculator.html')

def run_pace_calculator(request):
    return render(request, 'calculators/run_pace_calculator.html')

def running_snack_calculator(request):
    return render(request, 'calculators/running_snack_calculator.html')

def race_improvement_calculator(request):
    return render(request, 'calculators/race_improvement_calculator.html')

def training_paces_calculator(request):
    return render(request, 'calculators/training_paces_calculator.html')

def ready_for_race_day(request):
    return render(request, 'calculators/ready_for_race_day.html')

def training_zones(request):
    return render(request, 'calculators/training_zones.html')

def run_calorie_calculator(request):
    return render(request, 'calculators/run_calorie_calculator.html')

def beginner_half_marathon(request):
    return render(request, 'plans/beginner_half_marathon.html')


