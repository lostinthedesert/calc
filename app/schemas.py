from pydantic import BaseModel, EmailStr

class User(BaseModel):
    name: str
    pword: str
    mail: EmailStr