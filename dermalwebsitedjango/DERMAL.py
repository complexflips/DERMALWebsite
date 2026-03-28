import tensorflow as tf

import keras

def runDERMAL(input):
    loadedModel = keras.models.load_model('/DERMALmodelfiles/model.keras')

    prediction=loadedModel.predict(input)
    
    return prediction
