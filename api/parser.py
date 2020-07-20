import pandas as pd
#import io
#import csv
import datetime
#from collections import defaultdict
import math


def parse_date(date, errores, pos):
    try:
        if type(date) is str:
            if date.rfind('/') >= 0:
                dia, mes, año = date.split('/')
            elif date.rfind('-') >= 0:
                dia, mes, año = date.split('-')
            else:
                raise Exception
        elif type(date) is datetime.datetime:
            return date.date()
        else:
            raise Exception
    except Exception:
        pos = f'({chr(65+pos[1])}, {str(pos[0]+2)})'
        errores.append({'tipo': 'Error de formato en fecha',
                        'detalle': f'{date} en posicion {pos}'})
        return 0  # error de formato
    return datetime.date(int(año), int(mes), int(dia))


def parse_excel(file_stream):
    """
    retorna un diccionario con la siguiente estructura
    {
        "year": int,
        "period": int,
        "start": datetime.date,
        "finish": datetime.date,
        "cursos": [
            {
                "semestre_malla": int,
                "codigo": str,
                "nombre": str,
                "seccion": int,
                "profesor": [
                    {
                        "nombre": str,
                    },
                    ...
                ],
                "evaluaciones": [
                    {
                        "titulo": str,
                        "fecha": datetime.date,
                        "tipo": int,
                    },
                    ...
                ],
            },
            ...
        ],
    }
    """
    errores = []
    try:
        read_xls = pd.read_excel(file_stream.file, index_col=None)
    except Exception:
        return {}, [{'Error de formato': 'el archivo entregado no tiene el formato correcto o está corrupto.'}]
    xls = read_xls.to_numpy()
    n_filas = len(xls)
    año = int(read_xls.to_csv(index=False).split(',')[1])
    periodo = xls[0][1]
    inicio = parse_date(xls[1][1], errores, [1, 1])
    fin = parse_date(xls[2][1], errores, [2, 1])
    keys = {}
    semestre = {'year': año, 'period': periodo,
                'start': inicio, 'finish': fin, 'cursos': []}
    for i, title in enumerate(xls[3]):
        keys[i] = title
    for i in range(4, n_filas):
        ref_curso = ''
        curso = {'profesor': [], 'evaluaciones': []}
        for j, val in enumerate(xls[i]):
            if keys[j] == 'Curso':
                codigo, nombre = val.split(':')
                curso['codigo'] = codigo.strip()
                curso['nombre'] = nombre.strip()
                ref_curso += val
            elif keys[j] == '# Sem.':
                curso['semestre_malla'] = int(
                    val.split("°")[0].replace('Â', ""))
            elif keys[j] == 'Prof':
                profes = val.split('/')
                for p in profes:
                    curso['profesor'].append({'nombre':p})
            elif keys[j] == 'Secc.':
                curso['seccion'] = val
                ref_curso += f' seccion {val}'
            else:
                if type(val) is float:
                    if math.isnan(val):
                        pass
                else:
                    titulo = keys[j]
                    fecha = parse_date(val, errores, [i, j])
                    if fecha:
                        eval = {}
                        eval['titulo'] = titulo
                        eval['tipo'] = titulo.split(' ')[0]
                        eval['fecha'] = fecha
                        print(type(val), val)
                        curso['evaluaciones'].append(eval)
                    else:
                        errores[-1]['accion'] = f'la evaluacion {titulo} del curso {ref_curso} no puede ser agregada.'
        semestre['cursos'].append(curso)
    print(errores)
    return semestre, errores
