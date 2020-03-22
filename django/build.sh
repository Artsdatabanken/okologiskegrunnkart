#!/bin/bash
docker build -t forvaltningsportal-django .
docker push artsdatabanken/forvaltningsportal-django:latest

