import cv2
import numpy as np
from tensorflow.keras.models import load_model
from pathlib import Path

MODEL_PATH = Path(__file__).parent / 'digits_best_model.keras'
model = load_model(MODEL_PATH)

cap = cv2.VideoCapture(0)

while cap.isOpened():

    ret , frame = cap.read()

    if not ret :
        break

    configured_frame = cv2.cvtColor( frame , cv2.COLOR_BGR2RGB )
    configured_frame = cv2.resize( configured_frame , ( 260 , 260 ))  

    img_array = np.array( configured_frame )
    img_array = np.expand_dims( img_array , axis = 0 )

    predictions = model.predict( img_array )
    label = np.argmax( predictions[0])

    confidence = np.max( predictions[0] ) * 100 
    confidence = np.round(confidence , 1 ) 

    cv2.putText( frame , f'Number: {label}', ( 50 , 50 ), 
                cv2.FONT_HERSHEY_SIMPLEX , 2 , ( 0 , 255 , 0) , 5 )
    
    cv2.putText( frame , f'Conf: {confidence}%', ( 50 , 120 ), 
                cv2.FONT_HERSHEY_SIMPLEX , 2 , ( 255 , 0 , 0) , 5 )


    cv2.imshow('Frame' , frame )

    if cv2.waitKey(1) & 0xFF == ord(' '):
        break

cap.release()
cv2.destroyAllWindows()
