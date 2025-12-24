from pydantic import BaseModel
from typing import List

class Message(BaseModel):
    role: str   # "user" | "assistant"
    text: str

class Session(BaseModel):
    session_id: str
    messages: List[Message] = []
