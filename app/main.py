from operator import mod
from fastapi import Depends, FastAPI, Request, status, HTTPException, Response
from fastapi.templating import Jinja2Templates
from fastapi.responses import Response

from pydantic import BaseModel, EmailStr

from sqlalchemy.orm import Session

import app.models as models, app.schemas as schemas

from app.database import SessionLocal, engine, get_db

from .config import settings

from .utils import hash, verify

models.Base.metadata.create_all(bind=engine)

app=FastAPI()

templates = Jinja2Templates(directory="app/templates")

@app.get("/")
def calculator(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/new_user")
def create_form(request: Request):
    return templates.TemplateResponse("new_user.html", {"request": request})


@app.post("/new_user", status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    check_name=db.query(models.Users).filter(models.Users.name==user.name).first()
    if check_name:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE)
    hashed_password=hash(user.pword)
    user.pword=hashed_password
    db_user = models.Users(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    data=db.query(models.Users).filter(models.Users.id==db_user.id).first()
    print(data.mail +" "+ data.name)
    return data.name

@app.get("/user_login")
def user_login(request: Request):
    return templates.TemplateResponse("user_login.html", {"request": request})

@app.post("/user_login")
def user_login(credentials:schemas.UserBase, db: Session=Depends(get_db)):
    user=db.query(models.Users).filter(models.Users.name==credentials.name).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    if not verify(credentials.pword, user.pword):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    print(credentials.name)
    return "here's your token"