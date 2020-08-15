from django.db import models

# Create your models here.
class Comment(models.Model):
    name = models.CharField(max_length=100)
    isGeneral = models.BooleanField()
    isQuestion = models.BooleanField()
    email = models.EmailField()
    message = models.CharField(max_length=1000)
    start_time = models.PositiveIntegerField()
    end_time = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
