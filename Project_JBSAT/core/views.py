from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework import status
from .models import Job ,User,Application
from .serializers import JobSerializer,JobSummarySerializer,ApplicationSerializer
from .permissions import IsEmployerOrReadOnly

@api_view(['GET']) 
def job_detail(request,pk):
    try:
        job=Job.objects.get(pk=pk)
    except Job.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer=JobSerializer(job)
    return Response(serializer.data)

@api_view(['GET','POST'])#allows post
@permission_classes([IsEmployerOrReadOnly])
def job_list(request):
    if request.method=="GET":
        # Fetch all job objects from the database
        jobs=Job.objects.all()
        # Filtering logic (optional)
        title_query= request.query_params.get('title')
        type_query=request.query_params.get("type")
        location_query=request.query_params.get("location") # Filter by location

        if title_query:
            jobs=jobs.filter(title__icontains=title_query)

        if type_query:
            jobs=jobs.filter(employment_type__icontains=type_query)

        if location_query:
            jobs=jobs.filter(location__icontains=location_query)
        # Pass the data to the serializer to convert it to JSON
        # 'many=True' is required because we are serializing a list of objects
        
        serializer = JobSummarySerializer(jobs,many=True)

        # Return the serialized data as a JSON response
        return Response(serializer.data)
    
    elif request.method =="POST":
        # Only reached if the user is an employer thanks to the permission
        serializer=JobSerializer(data=request.data)
        if serializer.is_valid():
            # Automatically set the current user as the employer
            serializer.save(employer=request.user)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated]) # Only logged-in users can apply
def apply_to_job(request, job_id):
    """
    Handle job application submission (Requirement FR-15).
    """
    # 1. Check if the job exists
    try:
        job = Job.objects.get(id=job_id)
    except Job.DoesNotExist:
        return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)

    # 2. Prevent employers from applying to jobs (Business Logic)
    if request.user.role == 'Employer':
        return Response({"error": "Employers cannot apply for jobs"}, status=status.HTTP_403_FORBIDDEN)

    # 3. Create the application
    data = {
        'job': job.id,
        'resume_url': request.data.get('resume_url') # Link to the resume
    }
    
    serializer = ApplicationSerializer(data=data)
    if serializer.is_valid():
        try:
            # Save with the current user as the seeker
            serializer.save(seeker=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception:
            # This catches the UNIQUE constraint error from Postgres
            return Response({"error": "You have already applied for this job"}, status=status.HTTP_400_BAD_REQUEST)
            
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
@permission_classes([IsAuthenticated]) # allow only connected users
def employer_applications(request):
    """
    List all applications received for jobs posted by the current employer (Requirement FR-08).
    """

    if request.user.role != 'Employer':
        return Response({"error": "Only employers can access this dashboard"}, status=status.HTTP_403_FORBIDDEN)

    # 2. selected the applications for the jobs posted by this emplyer.
    # We use the notation __ to navigate from Application -> Job -> Employer
    applications = Application.objects.filter(job__employer=request.user)

    # 3. data serialization
    serializer = ApplicationSerializer(applications, many=True)
    return Response(serializer.data)



@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_application_status(request, pk):
    """
    Update the status of a specific application (Requirement FR-10).
    Only the employer who posted the job can change the status.
    """
    try:
        # Fetch the application by its primary key (id)
        application = Application.objects.get(pk=pk)
    except Application.DoesNotExist:
        return Response({"error": "Application not found"}, status=status.HTTP_404_NOT_FOUND)

    # Security check: Ensure the requester is the owner of the job
    if application.job.employer != request.user:
        return Response(
            {"error": "You are not authorized to review applications for this job"}, 
            status=status.HTTP_403_FORBIDDEN
        )

    # Get the new status from the request data
    new_status = request.data.get('status')
    
    # Validate the new status against allowed choices (Requirement Section 8.5)
    valid_statuses = [choice[0] for choice in Application.STATUS_CHOICES]
    if new_status not in valid_statuses:
        return Response(
            {"error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    # Update the status and save
    application.status = new_status
    application.save()

    # Return the updated application data
    serializer = ApplicationSerializer(application)
    return Response(serializer.data)







# from django.shortcuts import render
# from .models import Job # import our model Job

# # Create your views here.

# def job_list(request):
#     # to take all the job in our database
#     jobs=Job.objects.all()

#     # we send them to the HTLM file (templates)
#     return render(request, 'core/job_list.html',{'jobs':jobs})