from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from deepface import DeepFace
import uvicorn
import tempfile
import os

app = FastAPI()

@app.post("/compare_faces")
async def compare_faces(image1: UploadFile = File(...), image2: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(image1.filename)[1]) as tmp1:
            tmp1.write(await image1.read())
            img1_path = tmp1.name

        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(image2.filename)[1]) as tmp2:
            tmp2.write(await image2.read())
            img2_path = tmp2.name

        result = DeepFace.verify(img1_path, img2_path)

        os.remove(img1_path)
        os.remove(img2_path)

        return JSONResponse(content={"is_same_person": result["verified"]})

    except Exception as e:
        if os.path.exists(img1_path):
            os.remove(img1_path)
        if os.path.exists(img2_path):
            os.remove(img2_path)
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
