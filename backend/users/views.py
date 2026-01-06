from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics
from .models import Note

# Create your views here.
@api_view(['GET'])
def hello_world(request):
    return Response("Hello, World!")

class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)
    
    def perform_create(self, serializer):
        # Vì extra_kwargs = {"author": {"read_only": True}} nên phải override lại hàm tạo serializer để thêm thông tin author là ng dùng đang đc authenticated
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.fulter(author=user)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
