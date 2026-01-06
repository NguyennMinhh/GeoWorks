from django.urls import path
from . import views

urlpatterns = [
    path('hello-world', views.hello_world, name='hello-world'),
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:note_id>", views.NoteDelete.as_view(), name="delete_note"),
    
]