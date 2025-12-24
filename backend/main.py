from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.session import router as session_router
from routes.voice import router as voice_router

app = FastAPI(title="Ora Voice AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(session_router, prefix="/api")
app.include_router(voice_router, prefix="/api")

@app.get("/")
def health():
    return {"status": "ok"}
