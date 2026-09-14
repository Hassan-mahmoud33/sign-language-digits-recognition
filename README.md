# Sign Language Digits Recognition

A small image classification project that recognizes sign language digits using a trained TensorFlow/Keras model. It includes a FastAPI web interface, a webcam script, and a Streamlit version.

## Project layout

```text
sign_lang_digits_recognition/
├── 1_train_model.ipynb       # Model training notebook
├── 2_real_time.py            # Webcam inference with OpenCV
├── 3_api.py                  # FastAPI application
├── 4_streamlit.py            # Streamlit application
├── 5_README.md
├── digits_best_model.keras   # Trained model
├── Dataset/                  # Training and evaluation data
├── templates/
│   └── index.html            # Web page
└── static/
    ├── style.css             # Page styles
    └── app.js                # Upload, camera, and API logic
```

## Requirements

Use Python 3.10 or newer, then install the project dependencies:

```powershell
python -m pip install fastapi uvicorn python-multipart tensorflow opencv-python pillow numpy jinja2
```

## Run the FastAPI app

Open PowerShell in the project folder:

```powershell
cd "C:\Users\B-UNIT\Desktop\computer_vision\image_classification\sign_lang_digits_recognition"
python -m uvicorn 3_api:app --reload
```

Open the web interface at:

```text
http://127.0.0.1:8000/
```

Interactive API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

Run Uvicorn from inside `sign_lang_digits_recognition`. Running `uvicorn 3_api:app` from the parent `image_classification` folder can cause this error:

```text
Could not import module "3_api"
```

## API usage

The prediction endpoint is:

```text
POST /api/predict
```

Send the image as a `multipart/form-data` field named `image`.

Example using PowerShell and `curl.exe`:

```powershell
curl.exe -X POST "http://127.0.0.1:8000/api/predict" -F "image=@test-image.jpg"
```

Example response:

```json
{
  "label": 4,
  "confidence": 96.32
}
```

`label` is the predicted digit. `confidence` is the prediction confidence as a percentage.

## Notes

- Use a clear image where the hand sign is easy to see.
- Images are converted to RGB and resized to `260 x 260` before inference.
- The frontend expects the API to run on port `8000`.
- Do not run multiple API instances on the same port.
- If you see `WinError 10048`, port `8000` is already in use. Stop the existing Uvicorn process or use another port:

  ```powershell
  python -m uvicorn 3_api:app --reload --port 8001
  ```

  When using another port, update `API_URL` in `static/app.js` as well.
- The HTML page is loaded from `templates/index.html`. CSS and JavaScript are served from `/static/style.css` and `/static/app.js`.

## Run the webcam version

```powershell
python 2_real_time.py
```

Press the space bar to close the camera window.
