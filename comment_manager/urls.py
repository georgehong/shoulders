from django.urls import path
from . import views

urlpatterns = [
    path('api/comments/', views.CommentListCreate.as_view() ),
]