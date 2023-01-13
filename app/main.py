from fastapi import Depends, FastAPI, Request, status, HTTPException, Response
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import Response, RedirectResponse

from pydantic import BaseModel, EmailStr

from sqlalchemy.orm import Session
from sqlalchemy import func, or_

import app.models as models, app.schemas as schemas

from app.database import SessionLocal, engine, get_db

from .config import settings

from typing import List

import csv

import os


models.Base.metadata.create_all(bind=engine)

app=FastAPI()

app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")

# HOME
@app.get("/")
def calculator(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# GET POST
@app.get("/get_post", response_model=List[schemas.ReturnPost])
def create_post(db: Session=Depends(get_db), limit: int=10, skip: int=0):
    posts=db.query(models.Posts).filter(models.Posts.comment_id==None).order_by(models.Posts.created_at.desc()).limit(limit).offset(skip).all()
    return posts

# @app.get("/get-posts")
# def redirect_get_posts():
#     response = RedirectResponse(url="/")
#     return response

# GET ONE POST
@app.get("/get_single/{id}", response_model=List[schemas.ReturnPost])
def create_post(id: int, db: Session=Depends(get_db), skip: int=0):
    post=db.query(models.Posts).filter(models.Posts.comment_id==id).order_by(models.Posts.created_at.desc()).offset(skip).all()
    return post

# CREATE POST
@app.post("/create_post")
def create_post(post: schemas.CreatePost, db: Session=Depends(get_db)):
    assert len(post.title) < 120, "Title cannot exceed 120 characters"
    assert len(post.content) < 5000, "Content cannot exceed 5000 characters"
    new_post=models.Posts(**post.dict())
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    new_post=db.query(models.Posts).filter(models.Posts.id==new_post.id).first()
    print(new_post.content)
    return {"id": new_post.id,
            "title": new_post.title,
            "content": new_post.content,
            "created_at": new_post.created_at}

# CREATE COMMENT
@app.post("/create_comment")
def create_comment(comment: schemas.CreateComment, db: Session=Depends(get_db)):
    assert len(comment.content) < 5000, "Comment cannot exceed 5000 characters"
    new_comment=models.Posts(**comment.dict())
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    new_comment=db.query(models.Posts).filter(models.Posts.id==new_comment.id).first()
    print(new_comment.content)
    return new_comment.comment_id

@app.get("/air_quality")
def air_quality():
    with open("../aqi2.csv", 'r') as f:
            reader = csv.DictReader(f)
            items = list(reader)
            f.close()
    items.reverse()
    del items[49:]
    return items

