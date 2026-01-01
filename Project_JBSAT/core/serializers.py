from rest_framework import serializers
from core.models import Job 
from .models import Application

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model=Job
        # Serialize all fields from the Job model
        fields='__all__'

class JobSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model=Job
        fields=["id","title","location","employment_type"]

class ApplicationSerializer(serializers.ModelSerializer):
    # We include some read-only fields for the response
    # These fields are not in the Application model, so we fetch them from relations
    # source='job.title' navigates to the related Job model to get its title
    job_title = serializers.ReadOnlyField(source='job.title')
    # source='seeker.full_name' gets the full name of the user who applied
    seeker_name = serializers.ReadOnlyField(source='seeker.full_name')
    class Meta:
        model=Application
        fields=["id",'job','seeker','job_title','seeker_name','resume_url','status','applied_at']
        read_only_fields=['status','applied_at','seeker']

# # core/serializers.py
# from rest_framework import serializers
# from .models import Job

# class JobSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Job
#         # Serialize all fields from the Job model
#         fields = '__all__'