FROM python:3.5

RUN mkdir -p /app

ADD ./requirements.txt /

RUN pip3 install -r requirements.txt

EXPOSE 8000

WORKDIR /app
