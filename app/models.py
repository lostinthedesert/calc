from sqlalchemy import Boolean, CheckConstraint, Column, ForeignKey, Integer, String
from sqlalchemy.sql.sqltypes import TIMESTAMP
from sqlalchemy.sql.expression import text
from sqlalchemy.orm import relationship

from app.database import Base

class Posts(Base):
    __tablename__="posts"
    id= Column(Integer, primary_key=True)
    title= Column(String, default="COMMENT", nullable=False)
    content= Column(String, nullable=False)
    comment_id= Column(Integer, nullable=True)
    created_at=Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))
