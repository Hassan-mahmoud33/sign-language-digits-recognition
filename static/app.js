const API_URL = 'http://127.0.0.1:8000/api/predict';

const fileInput = document.querySelector('#fileInput');
const browseButton = document.querySelector('#browseButton');
const dropzone = document.querySelector('#dropzone');
const previewBox = document.querySelector('#previewBox');
const previewImage = document.querySelector('#previewImage');
const fileName = document.querySelector('#fileName');
const analyzeButton = document.querySelector('#analyzeButton');
const errorMessage = document.querySelector('#errorMessage');
const connectionLabel = document.querySelector('#connectionLabel');
const resultHint = document.querySelector('#resultHint');
const resultNumber = document.querySelector('#resultNumber');
const confidenceValue = document.querySelector('#confidenceValue');
const confidenceBar = document.querySelector('#confidenceBar');
const cameraButton = document.querySelector('#cameraButton');
const cameraView = document.querySelector('#cameraView');
const video = document.querySelector('#video');
const captureButton = document.querySelector('#captureButton');
const closeCameraButton = document.querySelector('#closeCameraButton');
const resetButton = document.querySelector('#resetButton');

let selectedFile = null;
let cameraStream = null;

function showError(message) { errorMessage.textContent = message; }

function showPreview(file) {
  if (!file || !file.type.startsWith('image/')) {
    showError('اختر ملف صورة بصيغة JPG أو PNG.');
    return;
  }
  selectedFile = file;
  previewImage.src = URL.createObjectURL(file);
  previewBox.classList.add('has-image');
  fileName.textContent = file.name;
  analyzeButton.disabled = false;
  resultHint.textContent = 'الصورة جاهزة';
  showError('');
}

browseButton.addEventListener('click', () => fileInput.click());
dropzone.addEventListener('click', (event) => { if (event.target !== browseButton) fileInput.click(); });
dropzone.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') fileInput.click(); });
fileInput.addEventListener('change', () => showPreview(fileInput.files[0]));
['dragenter', 'dragover'].forEach((eventName) => dropzone.addEventListener(eventName, (event) => { event.preventDefault(); dropzone.classList.add('is-dragging'); }));
['dragleave', 'drop'].forEach((eventName) => dropzone.addEventListener(eventName, (event) => { event.preventDefault(); dropzone.classList.remove('is-dragging'); }));
dropzone.addEventListener('drop', (event) => showPreview(event.dataTransfer.files[0]));

cameraButton.addEventListener('click', async () => {
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
    video.srcObject = cameraStream;
    cameraView.classList.remove('hidden');
    cameraButton.classList.add('hidden');
  } catch (error) { showError('تعذر فتح الكاميرا. اسمح بالوصول إليها أو استخدم رفع صورة.'); }
});

captureButton.addEventListener('click', () => {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth; canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  canvas.toBlob((blob) => showPreview(new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })), 'image/jpeg', .92);
  closeCamera();
});
closeCameraButton.addEventListener('click', closeCamera);
function closeCamera() { if (cameraStream) cameraStream.getTracks().forEach((track) => track.stop()); cameraStream = null; cameraView.classList.add('hidden'); cameraButton.classList.remove('hidden'); }

analyzeButton.addEventListener('click', async () => {
  if (!selectedFile) return;
  const formData = new FormData();
  formData.append('image', selectedFile);
  analyzeButton.disabled = true;
  analyzeButton.innerHTML = 'جارٍ التحليل... <span>◌</span>';
  connectionLabel.textContent = 'النموذج يحلل الصورة';
  resultHint.textContent = 'جارٍ التحليل';
  showError('');
  try {
    const response = await fetch(API_URL, { method: 'POST', body: formData });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'حدث خطأ أثناء التحليل.');
    const confidence = Number(data.confidence);
    resultNumber.textContent = data.label;
    confidenceValue.textContent = `${confidence.toFixed(2)}%`;
    confidenceBar.style.width = `${Math.min(Math.max(confidence, 0), 100)}%`;
    resultHint.textContent = 'تم التحليل بنجاح';
    connectionLabel.textContent = 'تم التعرف على الرقم';
  } catch (error) {
    showError(`${error.message} تأكد أن API يعمل على المنفذ 8000.`);
    connectionLabel.textContent = 'تعذر الاتصال بالـ API';
    resultHint.textContent = 'فشل التحليل';
  } finally { analyzeButton.disabled = false; analyzeButton.innerHTML = 'تحليل الصورة <span>←</span>'; }
});

resetButton.addEventListener('click', () => { selectedFile = null; fileInput.value = ''; previewImage.removeAttribute('src'); previewBox.classList.remove('has-image'); fileName.textContent = 'لم يتم اختيار ملف'; analyzeButton.disabled = true; resultNumber.textContent = '—'; confidenceValue.textContent = '—'; confidenceBar.style.width = '0'; resultHint.textContent = 'بانتظار صورة'; connectionLabel.textContent = 'جاهز للتحليل'; showError(''); });
