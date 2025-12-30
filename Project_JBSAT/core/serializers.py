from rest_framework import serializers
from core.models import Job 

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model=Job
        # Serialize all fields from the Job model
        fields='__all__'

class JobSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model=Job
        fields=["id","title","location","employment_type"]


# # core/serializers.py
# from rest_framework import serializers
# from .models import Job

# class JobSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Job
#         # Serialize all fields from the Job model
#         fields = '__all__'