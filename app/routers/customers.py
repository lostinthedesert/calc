from fastapi import Depends, FastAPI, Request, status, HTTPException, Response, APIRouter
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import Response

from pydantic import BaseModel, EmailStr

from sqlalchemy.orm import Session
from sqlalchemy import func

import app.models as models, app.schemas as schemas

from app.database import SessionLocal, engine, get_db

from ..config import settings

router=APIRouter(
    prefix="/customers",
    tags=["customers"]
)

templates = Jinja2Templates(directory="app/templates")


# CREATE CUSTOMER IN DB
@router.get("/")
def new_customer(request: Request):
    return templates.TemplateResponse("index2.html", {"request": request})

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_customer(customer: schemas.CreateCustomer, db: Session = Depends(get_db)):
    new_customer=models.Customers(**customer.dict())
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    return {"customer_first":customer.first_name, "customer_last":customer.last_name}


@router.get("/find_customer")
def create_customer(db: Session = Depends(get_db)):
    pass