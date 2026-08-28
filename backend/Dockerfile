FROM python:3.14


WORKDIR /backend

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade -r /backend/requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "-m", "main"]

