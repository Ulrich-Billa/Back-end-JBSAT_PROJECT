from django.urls import path
from . import views
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView

urlpatterns=[ 
            # Job endpoints
            path('api/jobs/',views.job_list,name="job_list"),
             path("api/jobs/<int:pk>/",views.job_detail,name="job_detail"),

             path('api/jobs/<int:job_id>/apply/', views.apply_to_job, name='apply_to_job'),

            # JWT Authentication endpoints
            # Login endpoint: gives access and refresh tokens
             path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
             # Refresh endpoint: gives a new access token when expired
            path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

            # Employer endpoints
            path('api/employer/applications/',views.employer_applications,name='employer_applications'),
             path('api/applications/<int:pk>/status/', views.update_application_status, name='update_status'),
             ]