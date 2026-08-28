FROM python:3.14


WORKDIR /backend


RUN pip install --no-cache-dir --upgrade -r /backend/requirements.txt

COPY . .

CMD ["python", "-m", "main"]