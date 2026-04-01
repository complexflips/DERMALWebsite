from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.parsers import JSONParser


# Create your views here.
def formSubmitted(request):
    if request.method=='POST':
        return HttpResponse("POST registered")
        image=JSONParser().parse(request)['image']
        symptoms=JSONParser().parse(request)['symptoms']



        input=[[image],[symptoms]]

        output=runDERMAL(input)

        return HttpResponse(output)
    else:
        return HttpResponse("invalid request")