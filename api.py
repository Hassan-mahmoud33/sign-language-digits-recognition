import io
from pathlib import Path
import numpy as np
import cv2
from PIL import Image

from fastapi import FastAPI , HTTPException , File , UploadFile , Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from tensorflow.keras.models import load_model

#------------------------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / 'digits_best_model.keras'

model = load_model( MODEL_DIR )

app = FastAPI(title="Sign_Language_Digits_Recognition")

app.mount('/static' , StaticFiles(directory= BASE_DIR / 'static') , name = 'static')

templates = Jinja2Templates(directory=BASE_DIR / 'templates')


#------------------------------------------------------------------------

def predict_digit( image : Image.Image ) -> tuple[str , float] :

    image_array = np.array(image.convert('RGB'), dtype=np.float32)
    image_array = cv2.resize(image_array, (260, 260))
    image_array = np.expand_dims(image_array, axis=0)

    probabilities = model.predict(image_array, verbose=0)[0]
    label = int(np.argmax(probabilities))
    confidence = float(np.max(probabilities))

    return label , confidence

#------------------------------------------------------------------------

@app.get('/' , response_class = HTMLResponse)

async def home( request : Request ) :

    return templates.TemplateResponse(
        request=request,
        name='index.html',
        context={'request': request},
    )


#------------------------------------------------------------------------

@app.post('/api/predict')

async def predict( image : UploadFile= File(...) ) :

    if not image.filename:
        raise HTTPException(status_code=400, detail="Please choose an image first.")


    try: 

        image_data = await image.read()
        uploaded_image = Image.open( io.BytesIO( image_data ))

        label , confidence = predict_digit( uploaded_image )

    except (OSError, ValueError):
        raise HTTPException(status_code=400,
                            detail="The uploaded file is not a valid image.")

    return {
        "label": label,
        "confidence": round(confidence * 100, 2),
           }

            
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)



