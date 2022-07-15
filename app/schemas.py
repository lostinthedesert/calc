from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    name: str
    pword: str
    

class UserCreate(UserBase):
    mail: EmailStr