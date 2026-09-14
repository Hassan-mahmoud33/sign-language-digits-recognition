# Sign Language Digits Recognition

Image classification project that recognizes sign language digits (0–9) from a hand image, using a TensorFlow/Keras model. The project includes a FastAPI web app, a live webcam script, and a Streamlit interface as an alternative frontend.

## Project layout

```text
sign_lang_digits_recognition/
├── train_model.ipynb        # Model training notebook
├── real_time.py             # Webcam inference with OpenCV
├── api.py                   # FastAPI application
├── streamlit.py             # Streamlit application
├── Dockerfile                # Container definition for the API
├── .dockerignore
├── requirements.txt
├── README.md
├── digits_best_model.keras  # Trained model
├── Dataset/                  # Training and evaluation data
├── templates/
│   └── index.html            # Web page
└── static/
    ├── style.css              # Page styles
    └── app.js                 # Upload, camera, and API logic
```

## Requirements

Python 3.10 or newer. Install dependencies with:

```powershell
pip install -r requirements.txt
```

## Running the API

### Option 1 — Directly with Python

From inside the `sign_lang_digits_recognition` folder:

```powershell
cd "sign_lang_digits_recognition"
python -m uvicorn api:app --reload
```

The web interface will be available at `http://127.0.0.1:8000/`, and the interactive API docs at `http://127.0.0.1:8000/docs`.

> Uvicorn needs to be run from inside this folder. Running it from the parent `image_classification` folder will raise `Could not import module "api"`.

### Option 2 — With Docker

Build the image:

```powershell
docker build -t sign-digits-api .
```

Run the container:

```powershell
docker run -p 8000:8000 sign-digits-api
```

Once running, open `http://localhost:8000/` in your browser. This is the recommended way to run the project, since it avoids dependency and environment issues entirely.

## API usage

Endpoint: `POST /api/predict`

Send the image as `multipart/form-data` under the field name `image`.

Example with `curl`:

```powershell
curl.exe -X POST "http://127.0.0.1:8000/api/predict" -F "image=@test-image.jpg"
```

Response:

```json
{
  "label": 4,
  "confidence": 96.32
}
```

`label` is the predicted digit (0–9), and `confidence` is the model's confidence as a percentage.

## Notes

- Images are converted to RGB and resized to `260x260` before being passed to the model.
- Use a clear, well-lit image where the hand sign is fully visible for better accuracy.
- The frontend (`static/app.js`) expects the API to be running on port `8000`. If you change the port, update `API_URL` there as well.
- If you get `WinError 10048`, port `8000` is already in use — either stop the process using it or run on a different port:

```powershell
  python -m uvicorn api:app --reload --port 8001
```

## Running the webcam version

```powershell
python real_time.py
```

Press the space bar to close the camera window.