from django.urls import path
from . import views

urlpatterns=[ path('api/jobs/',views.job_list,name="job_list"),
             path("api/jobs/<int:pk>/",views.job_detail,name="job_detail"),
             ]