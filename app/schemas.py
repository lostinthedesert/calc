from datetime import datetime
import email
from typing import Optional
from pydantic import BaseModel, EmailStr

class CreatePost(BaseModel):
    title: str
    content: str

class ReturnPost(BaseModel):
    id: int
    title: Optional[str]=None
    content: str
    created_at: datetime

    class Config:
        orm_mode = True

class CreateComment(BaseModel):
    content: str
    comment_id: int

class ReturnComment(CreateComment):
    created_at: datetime

    class Config:
        orm_mode = True
