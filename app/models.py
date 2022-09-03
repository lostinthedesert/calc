from sqlalchemy import Boolean, CheckConstraint, Column, ForeignKey, Integer, String
from sqlalchemy.sql.sqltypes import TIMESTAMP
from sqlalchemy.sql.expression import text
from sqlalchemy.orm import relationship

from app.database import Base

# class Users(Base):
#     __tablename__= "users"
#     id = Column(Integer, primary_key=True)
#     name = Column(String, nullable=False, unique=True)
#     pword = Column(String, nullable=False)
#     mail = Column(String, nullable=False)

class Posts(Base):
    __tablename__="posts"
    id= Column(Integer, primary_key=True)
    title= Column(String, nullable=False)
    content= Column(String, nullable=False)
    created_at=Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))

# class Customers(Base):
#     __tablename__="customers"
#     id= Column(Integer, primary_key=True)
#     first_name= Column(String, nullable=False)
#     last_name= Column(String, nullable=False)
#     phone= Column(String, nullable=False)
#     email=Column(String, nullable=False)