from keras import model_from_json 
import tensorflow as tf

jsonFile=open('model.json','r')
loadedModelJson=jsonFile.read()
jsonFile.close()

model=model_from_json(loadedModelJson)

model.load_weights("model.weights.h5")

model.compile()