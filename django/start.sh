#!/bin/bash
python manage.py migrate
python manage.py runserver 0:8000
