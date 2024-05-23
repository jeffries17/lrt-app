import os
import json
import logging
from django.http import JsonResponse, HttpResponse
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
import pdfkit
from django.conf import settings

logger = logging.getLogger(__name__)

@csrf_exempt
def generate_pdf(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            plan_html = data.get('plan_html')
            email = data.get('email', None)

            logger.info('Generating PDF')
            logger.info('HTML content: %s', plan_html[:100])  

            pdfkit_config = pdfkit.configuration(wkhtmltopdf=settings.WKHTMLTOPDF_CMD)

            pdf = pdfkit.from_string(plan_html, False, configuration=pdfkit_config, options=settings.PDFKIT_OPTIONS)
            logger.info('PDF generated successfully, size: %d bytes', len(pdf))

            if email:
                # Send email with PDF attachment
                email_message = EmailMessage(
                    'Your Custom Training Plan',
                    'Please find attached your custom training plan.',
                    settings.EMAIL_HOST_USER,
                    [email],
                )
                email_message.attach('training_plan.pdf', pdf, 'application/pdf')
                email_message.send()
                logger.info('Email sent successfully to %s', email)
                return JsonResponse({'message': 'Email sent successfully!'})
            else:
                response = HttpResponse(pdf, content_type='application/pdf')
                response['Content-Disposition'] = 'attachment; filename="training_plan.pdf"'
                return response
        except Exception as e:
            logger.error('Error generating PDF and sending email: %s', e)
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request'}, status=400)

def home(request):
    return render(request, 'home.html')

def about(request):
    return render(request, 'about.html')

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

def age_grade_calculator(request):
    return render(request, 'calculators/age_grade_calculator.html')

def beginner_half_marathon(request):
    return render(request, 'plans/beginner_half_marathon.html')

def beginner_marathon(request):
    return render(request, 'plans/beginner_marathon.html')

def run_calculators(request):
    return render(request, 'run_calculators.html')

def training_plans(request):
    return render(request, 'training_plans.html')
