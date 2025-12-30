from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Job
from .serializers import JobSerializer,JobSummarySerializer
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
        search_query= request.query_params.get('search')
        if search_query:
            jobs=jobs.filter(title__icontains=search_query)
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


















# from django.shortcuts import render
# from .models import Job # import our model Job

# # Create your views here.

# def job_list(request):
#     # to take all the job in our database
#     jobs=Job.objects.all()

#     # we send them to the HTLM file (templates)
#     return render(request, 'core/job_list.html',{'jobs':jobs})