from fastapi import Depends, FastAPI, Request, status, HTTPException, Response
from fastapi.templating import Jinja2Templates
from fastapi.responses import Response

from pydantic import BaseModel, EmailStr

from sqlalchemy.orm import Session

import app.models as models, app.schemas as schemas

from app.database import SessionLocal, engine, get_db

from .config import settings

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
def create_user(user: schemas.User, db: Session = Depends(get_db)):
    db_user = models.Users(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)