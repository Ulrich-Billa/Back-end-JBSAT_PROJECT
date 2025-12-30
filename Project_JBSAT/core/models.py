from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# --- GESTIONNARY for users --- full_name,role="seeker",
class UserManager(BaseUserManager):
    def create_user(self, email, full_name, password=None, **extra_fields):
        if not email: 
            raise ValueError("The email is mandatory")
        email = self.normalize_email(email)
        user = self.model(email=email, full_name=full_name, **extra_fields)
        user.set_password(password) # Encrypt the password before saving
        user.save(using=self._db)   
        return user

    def create_superuser(self, email, full_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get ("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True")
        if extra_fields.get ("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        
        return self.create_user(email,full_name, password, **extra_fields)

# --- POINT 1 : MY USER MODEL ---
class User(AbstractBaseUser, PermissionsMixin):

    ROLE_CHOICE= ( ("employer","Employer"),
                  ("seeker","Seeker"), )
    
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True, max_length=255)
    role = models.CharField(max_length=50 , choices=ROLE_CHOICE,default='seeker')
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='core_user_groups',  # a unique name to avoid conflict
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='core_user_permissions', # a unique name to avoid conflict
        blank=True
    )

    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    @property
    def is_employer(self): # to check if the user is employer
        return self.role=="employer"

    @property
    def is_seeker(self):

        return self.role=="seeker"

    class Meta:
        managed = True
        db_table = 'User'

        
# --- POINT 2 & 3 : TES AUTRES TABLES ---
class Job(models.Model):
    employer = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    title = models.CharField(max_length=255)
    description = models.TextField() # Changé en TextField pour plus de place
    location = models.TextField()
    employment_type = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = True
        db_table = 'job'

class Application(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, blank=True, null=True)
    seeker = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    resume_url = models.TextField()
    status = models.CharField(max_length=50, default='pending')
    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = True
        db_table = 'application'