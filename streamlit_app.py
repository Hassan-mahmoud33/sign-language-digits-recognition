import streamlit as st
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image
import cv2
from pathlib import Path

MODEL_PATH = Path(__file__).parent / 'digits_best_model.keras'

model = load_model(MODEL_PATH)

st.title('Digit Recognition')

uploaded = st.file_uploader('Put An Image', type=['jpg' , 'jpeg' , 'png'])

if uploaded is not None :

    img = Image.open( uploaded )
    img = img.resize((260 , 260))
    img = np.array(img)

    img = np.expand_dims( img , axis= 0 )

    st.image( img )


    if st.button('Predict') :

        prediction = model.predict( img )[0]
        label = np.argmax( prediction , axis = 0 )
        conf = np.round( float( np.max(prediction) * 100) , 1 )

        st.write(f'Prediction: {label}' )
        st.write(f'Confidence: {conf}%' )