import tensorflowjs as tfjs
from tensorflow import keras

model = keras.models.load_model("digits.keras")
tfjs.converters.save_keras_model(model, "jsmodel")