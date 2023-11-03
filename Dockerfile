FROM python:3.9-slim

LABEL maintainer="darmiel <hi@d2a.io>"
LABEL org.opencontainers.image.source = "https://github.com/darmiel/more-jpeg"

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /usr/src/app

RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt


COPY . .

EXPOSE 8080
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "wsgi:app"]
