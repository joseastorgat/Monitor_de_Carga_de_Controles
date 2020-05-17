import os
from os import remove
from os import path as p
from django.core.management import execute_from_command_line

paths = [
        './db.sqlite3',
        './api/migrations/0001_initial.py',
        './api/migrations/__pycache__/__init__.cpython-36.pyc',
        './api/migrations/__pycache__/0001_initial.cpython-36.pyc',
        ]

for path in paths:
    if p.exists(path):
        remove(path)
        print(path,"eliminado")

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'MCC.settings')

execute_from_command_line(['manage.py', 'makemigrations'])
execute_from_command_line(['manage.py', 'migrate'])