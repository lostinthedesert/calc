from sqlalchemy import Boolean, CheckConstraint, Column, ForeignKey, Integer, String, collate

from app.database import Base

class Users(Base):
    __tablename__= "users"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    pword = Column(String, nullable=False)
    mail = Column(String, nullable=False)