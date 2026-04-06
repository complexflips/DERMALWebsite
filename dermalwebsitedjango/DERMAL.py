import keras
import numpy as np

from PIL import Image

def makemodel(input):
    #load a previously saved model of DERMAL, and run a prediction on the inpu
    loadedModel = keras.models.load_model('DERMALmodelfiles\model.keras')

    prediction=loadedModel.predict(input)
    
    return prediction

def runDermal(input):
    #make sure image is resized 
    image=(input[0]).resize((256,256))
    #format the image for use in keras model
    imageArray=np.array(image) / 255.0

    return(makemodel([np.array([imageArray]),np.array([input[1]])]))