from datetime import datetime
import email
from re import S
from typing import Optional
from pydantic import BaseModel, EmailStr, validator


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
    
    @validator('created_at')
    def format_date(cls, datetime):
        return datetime.strftime("%b %d, %Y at %I:%M%p")
        

class CreateComment(BaseModel):
    content: str
    comment_id: int

class ReturnComment(CreateComment):
    created_at: datetime

    class Config:
        orm_mode = True
        

