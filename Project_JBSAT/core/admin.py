from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import User, Job, Application 

# --- FORMS ---

class MyUserCreationForm(UserCreationForm):
    """
    Overriding the creation form to use 'email' and include your custom fields.
    """
    class Meta:
        model = User
        fields = ("email", "full_name", "role")

class MyUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = ("email", "full_name", "role", "is_active", "is_staff")

# --- ADMIN ---

class MyUserAdmin(UserAdmin):
    add_form = MyUserCreationForm
    form = MyUserChangeForm
    
    list_display = ('email', 'full_name', 'role', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_active')

    # Fields for the Edit User page
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('full_name', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )

    # Fields for the Add User page
    # Note: 'password1' and 'password2' are the standard names in UserCreationForm
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'full_name', 'role', 'password1', 'password2'), 
        }),
    )

    search_fields = ('email', 'full_name')
    ordering = ('email',)

# --- REGISTRATION ---

admin.site.register(User, MyUserAdmin)
admin.site.register(Job)
admin.site.register(Application)


