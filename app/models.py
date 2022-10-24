from sqlalchemy import Boolean, CheckConstraint, Column, ForeignKey, Integer, String
from sqlalchemy.sql.sqltypes import TIMESTAMP
from sqlalchemy.sql import expression
from sqlalchemy.sql.expression import text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.compiler import compiles
from sqlalchemy.types import DateTime

from app.database import Base

class utcnow(expression.FunctionElement):
    type = DateTime()
    inherit_cache = True

@compiles(utcnow, 'postgresql')
def pg_utcnow(element, compiler, **kw):
    return "TIMEZONE('utc', CURRENT_TIMESTAMP)"

class Posts(Base):
    __tablename__="posts"
    id= Column(Integer, primary_key=True)
    title= Column(String, default="COMMENT", nullable=False)
    content= Column(String, nullable=False)
    comment_id= Column(Integer, nullable=True)
    created_at=Column(DateTime, nullable=False, server_default=utcnow())
