from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    name: str
    pword: str 

class UserCreate(UserBase):
    mail: EmailStr

class CreatePost(BaseModel):
    title: str
    content: str

class ReturnPost(CreatePost):
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str
    name: str

class TokenData(BaseModel):
    id: Optional[str]=None