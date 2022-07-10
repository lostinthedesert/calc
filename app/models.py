from sqlalchemy import Boolean, Column, ForeignKey, Integer, String

from app.database import Base

class Users(Base):
    __tablename__= "users"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    pword = Column(String, nullable=False)
    mail = Column(String, nullable=False)