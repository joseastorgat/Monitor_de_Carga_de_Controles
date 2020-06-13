import os
from os import remove
from os import path as p
from django.core.management import execute_from_command_line
from pathlib import Path
from parser_data import parse_csv


def limpiar():
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
    from api.models import Semestre, Ramo, Profesor, Curso, Evaluacion

    with open("./csv/semestre_test.csv", "r") as file:
        semester = parse_csv(file)
    sem = Semestre.objects.create(año=semester['year'], inicio=semester['start'] , fin=semester['finish'] , periodo=semester['period'], estado=3)
    for curso in semester["cursos"]:
        ramo, ramo_created = Ramo.objects.get_or_create(nombre=curso['nombre_ramo'], codigo=curso['codigo'], semestre_malla=curso['semestre_malla'])
        print(ramo)
        curso_inst = Curso.objects.create(ramo=ramo, semestre=sem, seccion=curso['seccion'])
        for profe in curso['profesor']:
            profe_nombre, profe_apellido = profe['nombre'].replace(' ','').split('.')
            profe_name = profe_nombre.capitalize()+'.'+profe_apellido.capitalize()
            prof, prof_created = Profesor.objects.get_or_create(nombre=profe_name)
            curso_inst.profesor.add(prof)
        for eval in curso['evaluaciones']:
            Evaluacion.objects.create(fecha=eval['fecha'],tipo=eval['tipo'],titulo=eval['titulo'],curso=curso_inst)
    print('listo')

limpiar()