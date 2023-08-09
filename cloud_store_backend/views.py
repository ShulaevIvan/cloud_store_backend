from django.shortcuts import render
from django.http import JsonResponse
import json

def index(request):
    return render(request, 'index.html')

def mainfest(request):
    with open('frontend/public/manifest.json', 'r', encoding='UTF-8') as f:
        text = json.load(f)
    
    return JsonResponse(text)