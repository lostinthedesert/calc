from fastapi import Depends, FastAPI, Request, status, HTTPException, Response, APIRouter
from fastapi.templating import Jinja2Templates

from sqlalchemy.orm import Session
from sqlalchemy import func

import app.models as models, app.schemas as schemas

from app.database import SessionLocal, engine, get_db

router=APIRouter(
    prefix="/customers",
    tags=["customers"]
)

templates = Jinja2Templates(directory="app/templates")


# CREATE CUSTOMER IN DB
@router.get("")
def new_customer(request: Request):
    return templates.TemplateResponse("index2.html", {"request": request})

@router.post("", status_code=status.HTTP_201_CREATED)
def create_customer(customer: schemas.CreateCustomer, db: Session = Depends(get_db)):
    new_customer=models.Customers(**customer.dict())
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    print(customer.last_name)
    return {"customer_first":customer.first_name, "customer_last":customer.last_name}


@router.post("/find_customer")
def find_customer(customer: schemas.SearchCustomer, db: Session = Depends(get_db)):
    inquiry=db.query(models.Customers).filter(models.Customers.last_name==customer.last_name).first()
    if not inquiry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    print(inquiry.first_name + inquiry.last_name)
    return {"first_name": inquiry.first_name, "last_name": inquiry.last_name, "phone": inquiry.phone, "email": inquiry.email}