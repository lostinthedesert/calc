from fastapi import Depends, FastAPI, Request, status, HTTPException, Response
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import Response
from fastapi.security import OAuth2PasswordRequestForm

from pydantic import BaseModel, EmailStr

from sqlalchemy.orm import Session
from sqlalchemy import func

import app.models as models, app.schemas as schemas

from app.database import SessionLocal, engine, get_db

from .config import settings

# from .utils import hash, verify

# from . import oauth2

# from .routers import customers

models.Base.metadata.create_all(bind=engine)

app=FastAPI()

# app.include_router(customers.router)

app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")



# HOME
@app.get("/")
def calculator(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# CREATE POST
@app.post("/create_post")
def create_post(post: schemas.CreatePost, db: Session=Depends(get_db)):
    new_post=models.Posts(**post.dict())
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    new_post=db.query(models.Posts).filter(models.Posts.id==new_post.id).first()
    print(new_post.content)
    return {"title": new_post.title,
            "content": new_post.content,
            "created": new_post.created_at}

# CREATE COMMENT
@app.post("/create_comment")
def create_comment(comment: schemas.CreateComment, db: Session=Depends(get_db)):
    new_comment=models.Posts(**comment.dict())
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    new_comment=db.query(models.Posts).filter(models.Posts.id==new_comment.id).first()
    print(new_comment.content)
    return {"title": new_comment.title,
            "content": new_comment.content,
            "created": new_comment.created_at}

# GET POST
@app.get("/get_post")
def create_post(db: Session=Depends(get_db), limit: int=10, skip: int=0):
    all_posts=db.query(models.Posts).order_by(models.Posts.created_at.desc()).limit(limit).offset(skip).all()
    list=[]
    for post in all_posts:
        list.append([post.title, post.content, str(post.created_at)])
    print(list[0][1])
    return {"posts": list}

# CREATE USER
# @app.post("/new_user", status_code=status.HTTP_201_CREATED)
# def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
#     check_name=db.query(models.Users).filter(func.lower(models.Users.name)==func.lower(user.name)).first()
#     if check_name:
#         raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE)
#     hashed_password=hash(user.pword)
#     user.pword=hashed_password
#     db_user = models.Users(**user.dict())
#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)
#     data=db.query(models.Users).filter(models.Users.id==db_user.id).first()
#     print(data.mail +" "+ data.name)
#     return data.name

# LOGIN
# @app.post("/login", response_model=schemas.Token)
# def user_login(credentials:OAuth2PasswordRequestForm=Depends(), db: Session=Depends(get_db)):
#     user=db.query(models.Users).filter(func.lower(models.Users.name)==func.lower(credentials.username)).first()
#     if not user:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
#     if not verify(credentials.password, user.pword):
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
#     access_token=oauth2.create_access_token(data={"user_id":user.id})
#     return {"access_token": access_token, "token_type": "bearer", "name": user.name}

# CREATE POSTS
# @app.get("/create_post")
# def create_post(request:Request, db: Session=Depends(get_db)):
#     name=db.query(models.Users).filter(models.Users.name==current_user.name).first()
#     print(name.name)
#     return templates.TemplateResponse("create_post.html", {"request": request, "name":name.name})

