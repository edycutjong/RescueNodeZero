FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
COPY actian_vectorai-0.*-py3-none-any.whl .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
