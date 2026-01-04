from rest_framework import serializers
from core.models import Job 
from .models import Application,User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


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



class UserRegistrationSerializer(serializers.ModelSerializer):
    # We define password as write_only so it's never sent back in JSON
    password = serializers.CharField(write_only=True,min_length=5)

    class Meta:
        model = User
        fields = ['full_name', 'email', 'password', 'role']

    def create(self, validated_data):
        # We use the create_user method to ensure the password is hashed correctly
        user = User.objects.create_user(
            email=validated_data['email'],
            full_name=validated_data['full_name'],
            password=validated_data['password'],
            role=validated_data.get('role', 'seeker')
        )
        return user



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Customizes the JWT response to include user details (name and role) 
    as expected by the React frontend.
    """
    def validate(self, attrs):
        # Call the original validation to get the tokens
        data = super().validate(attrs)

        # Add custom data from our User model (SRS Requirement)
        data['userName'] = self.user.full_name
        data['userRole'] = self.user.role
        
        return data