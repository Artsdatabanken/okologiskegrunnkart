FROM python:3

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
RUN groupadd -r --gid 1007 dockerrunner && useradd -r -g dockerrunner dockerrunner


EXPOSE 8000
USER dockerrunner
CMD [ "./start.sh", "--port", "8000" ]

