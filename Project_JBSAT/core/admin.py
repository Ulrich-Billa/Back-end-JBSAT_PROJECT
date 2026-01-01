from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
# We import the models created for the project
from .models import User, Job, Application 

# We create a custom Admin class to handle the User model security and password hashing
class MyUserAdmin(UserAdmin):
    # We define which columns to show in the users list
    list_display = ('email', 'full_name', 'role', 'is_staff')
    
    # We organize the fields in the edit page. 
    # This structure is what triggers the secure password "change form" link.
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('full_name', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )
    
    # We define the default ordering by email
    ordering = ('email',)

# We register the models to appear in the admin interface.
# Note: We link 'User' with 'MyUserAdmin' to enable security features.
admin.site.register(User, MyUserAdmin)
admin.site.register(Job)
admin.site.register(Application)









# from django.contrib import admin
# #from django.contrib.auth.admin import UserAdmin
# # We import the models created by inspectdb for me
# from .models import User, Job, Application 

# # We register them to appear in the admin interface.
# admin.site.register(User)
# admin.site.register(Job)
# admin.site.register(Application)