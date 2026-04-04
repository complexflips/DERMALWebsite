from django.http import HttpResponse
from django.shortcuts import render
from DERMAL import runDermal
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer





@api_view(('POST',))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def formSubmitted(request):
    if request.method=='POST':
        
        inputdict=JSONParser().parse(request)
        
        image=inputdict['image']

        symptoms=list(inputdict['symptoms'].values())

        duration=inputdict['duration']

        

        print([[image],symptoms+[duration]])

        return Response("POST registered")
        input=[[image],[symptoms]]

        output=runDermal(input)

        return Response("POST registered")
    else:
        return HttpResponse("invalid request")