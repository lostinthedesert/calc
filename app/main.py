from fastapi import Depends, FastAPI, Request, status, HTTPException, Response
from fastapi.templating import Jinja2Templates
from fastapi.responses import Response
from fastapi.security import OAuth2PasswordRequestForm

from pydantic import BaseModel, EmailStr

from sqlalchemy.orm import Session
from sqlalchemy import func

import app.models as models, app.schemas as schemas

from app.database import SessionLocal, engine, get_db

from .config import settings

from .utils import hash, verify

from . import oauth2

from typing import List

models.Base.metadata.create_all(bind=engine)

app=FastAPI()

templates = Jinja2Templates(directory="app/templates")

# HOME
@app.get("/")
def calculator(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# CREATE USER
@app.get("/new_user")
def create_form(request: Request):
    return templates.TemplateResponse("new_user.html", {"request": request})

@app.post("/new_user", status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    check_name=db.query(models.Users).filter(func.lower(models.Users.name)==func.lower(user.name)).first()
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

# LOGIN
@app.get("/login")
def user_login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.post("/login", response_model=schemas.Token)
def user_login(credentials:OAuth2PasswordRequestForm=Depends(), db: Session=Depends(get_db)):
    user=db.query(models.Users).filter(func.lower(models.Users.name)==func.lower(credentials.username)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    if not verify(credentials.password, user.pword):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    access_token=oauth2.create_access_token(data={"user_id":user.id})
    return {"access_token": access_token, "token_type": "bearer", "name": user.name}

@app.get("/get_post")
def create_post(request:Request, current_user: int=Depends(oauth2.get_current_user), db: Session=Depends(get_db), limit: int=10):
    all_posts=db.query(models.Posts).order_by(models.Posts.created_at.desc()).limit(limit).all()
    list=[]
    for post in all_posts:
        list.append([post.title, post.content, str(post.created_at)])
    # print(list)
    return templates.TemplateResponse("get_post.html", {"request": request, "posts": list})



@app.get("/create_post")
def create_post(request:Request, current_user: int=Depends(oauth2.get_current_user), db: Session=Depends(get_db)):
    name=db.query(models.Users).filter(models.Users.name==current_user.name).first()
    print(name.name)
    return templates.TemplateResponse("create_post.html", {"request": request, "name":name.name})

@app.post("/create_post")
def create_post(request: Request, post: schemas.CreatePost, current_user: int=Depends(oauth2.get_current_user), db: Session=Depends(get_db)):
    new_post=models.Posts(**post.dict())
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    new_post=db.query(models.Posts).filter(models.Posts.id==new_post.id).first()
    return templates.TemplateResponse("post_created.html", {"request": request, 
                                                            "title": new_post.title,
                                                            "content": new_post.content,
                                                            "created": new_post.created_at})
