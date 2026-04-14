from django.http import HttpResponse
from django.shortcuts import render
from DERMAL import runDermal
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer
from sklearn.preprocessing import OrdinalEncoder
from django.template.loader import get_template
import numpy as np
import json
from PIL import Image

def encodeDuration(duration):
    #to run the model, I require duration to be encoded
    #I therefore have to do this preprocessing step 
    encoder=OrdinalEncoder(categories=[['UNKNOWN',
                                     'ONE_DAY',
                                     'LESS_THAN_ONE_WEEK',
                                     'ONE_TO_FOUR_WEEKS',
                                     'ONE_TO_THREE_MONTHS',
                                     'THREE_TO_TWELVE_MONTHS',
                                     'MORE_THAN_ONE_YEAR',
                                     'MORE_THAN_FIVE_YEARS',
                                     'SINCE_CHILDHOOD'
                                     ]])

    return encoder.fit_transform(np.array(duration).reshape(1, -1))

def formatOutput(rawOutput):
    formattedOutput=[]
    for i in rawOutput:
        i=i.round()
        if i:
            pass


@api_view(('POST','GET'))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def formSubmitted(request):
    if request.method=='POST':
        inputdict=request.data

        image=Image.open(inputdict['image'].file)

        symptoms=list(json.loads(inputdict['symptoms']).values())

        duration=inputdict['duration']

        duration=encodeDuration(duration)

        input=[image,np.concatenate((np.array(symptoms),np.array(duration[0])))]

        rawOutput=runDermal(input)

        formatOutput(rawOutput[0])

        template = get_template('response.html')

        return HttpResponse('test')
    if request.method=='GET':
        return HttpResponse("Incorrect ")