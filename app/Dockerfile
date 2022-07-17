FROM python:3.9
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1 
WORKDIR /usr/src/app
COPY requirements.txt .

RUN apt update \
    && python -m pip install --upgrade pip \
    && pip install -r requirements.txt

COPY . .