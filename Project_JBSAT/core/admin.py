from django.contrib import admin
# We import the models created by inspectdb for me
from .models import User, Job, Application 

# We register them to appear in the admin interface.
admin.site.register(User)
admin.site.register(Job)
admin.site.register(Application)