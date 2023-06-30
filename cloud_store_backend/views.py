from django.shortcuts import render
import os

def index(request):
    print(os.path)
    return render(request, 'index.html')