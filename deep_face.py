from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from deepface import DeepFace
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import tempfile
import os
import base64

app = FastAPI()
class FaceCompareRequest(BaseModel):
    image1: str  
    image2: str 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],)

@app.post("/compare_faces_base64")
async def compare_faces_base64(request: FaceCompareRequest):
    try:
        img1_data = base64.b64decode(request.image1)
        img2_data = base64.b64decode(request.image2)

        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp1:
            tmp1.write(img1_data)
            img1_path = tmp1.name

        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp2:
            tmp2.write(img2_data)
            img2_path = tmp2.name

        result = DeepFace.verify(img1_path, img2_path)

        os.remove(img1_path)
        os.remove(img2_path)

        return {"is_same_person": result["verified"]}

    except Exception as e:
        if os.path.exists(img1_path):
            os.remove(img1_path)
        if os.path.exists(img2_path):
            os.remove(img2_path)
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
