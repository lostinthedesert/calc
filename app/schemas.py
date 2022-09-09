from datetime import datetime
import email
from typing import Optional
from pydantic import BaseModel, EmailStr


# class UserBase(BaseModel):
#     name: str
#     pword: str 

# class UserCreate(UserBase):
#     mail: EmailStr

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


# class Token(BaseModel):
#     access_token: str
#     token_type: str
#     name: str

# class TokenData(BaseModel):
#     id: Optional[str]=None

# class CreateCustomer(BaseModel):
#     first_name: str
#     last_name: str
#     phone: str
#     email: EmailStr

# class SearchCustomer(BaseModel):
#     last_name: str

# class CustomerResult(CreateCustomer):
#     pass
