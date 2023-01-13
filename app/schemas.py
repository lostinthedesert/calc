from datetime import datetime
import email
from re import S
from typing import Optional
from pydantic import BaseModel, EmailStr, validator

epoch = datetime.utcfromtimestamp(0)

class CreatePost(BaseModel):
    title: str
    content: str

class ReturnPost(BaseModel):
    id: int
    title: Optional[str]=None
    content: str
    created_at: datetime
    comment_id: Optional[int]=None

    class Config:
        orm_mode = True
    
    @validator('created_at')
    def format_date(cls, datetime):
        return (datetime - epoch).total_seconds() * 1000.0
        

class CreateComment(BaseModel):
    content: str
    comment_id: int

class ReturnComment(CreateComment):
    created_at: datetime

    class Config:
        orm_mode = True
        

        # gjhgjh

