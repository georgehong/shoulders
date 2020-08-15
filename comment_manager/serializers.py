# Converts Python class to JSON in a browser!  

from rest_framework import serializers 
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 
                  'name', 
                  'email', 
                  'message', 
                  'isGeneral', 
                  'isQuestion', 
                  'start_time', 
                  'end_time')