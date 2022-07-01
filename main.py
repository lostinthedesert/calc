from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import Response

app=FastAPI()

templates = Jinja2Templates(directory="templates")

@app.get("/")
def calculator(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})
