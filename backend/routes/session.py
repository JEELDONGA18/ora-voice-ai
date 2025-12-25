from fastapi import APIRouter
import uuid

router = APIRouter()

@router.post("/session")
def create_session():
    return {"sessionId": str(uuid.uuid4())}
