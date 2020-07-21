import pandas as pd
# import io
# import csv
import datetime
# from collections import defaultdict
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


def parse_periodo(periodo, errores, pos):
    # TODO: hacer el parse en busca de errores
    return periodo


def parse_curso(val, errores, pos):
    return val.split(':')


def parse_semestre_malla(val, errores, pos):
    try:
        if ('Electivo' in val) or 'electivo' in val:
            return 15
        val = val.strip()
        if "°" in val:
            return int(val.split("°")[0].replace('Â', ""))
        else:
            return int(val.split(" ")[0])
    except Exception as e:
        print(e)
        pos = f'({chr(65+pos[1])}, {str(pos[0]+2)})'
        errores.append({'tipo': 'Error de formato en nombre profesor',
                        'detalle': f'{val} en posicion {pos}'})
        return 0  # error de formato


def parse_profesores(val, errores, pos):
    try:
        if type(val) is float:
            return ['pendiente']
        return val.split('/')
    except Exception as e:
        print(e)
        pos = f'({chr(65+pos[1])}, {str(pos[0]+2)})'
        errores.append({'tipo': 'Error de formato en nombre profesor',
                        'detalle': f'{val} en posicion {pos}'})
        return 0  # error de formato


def parse_seccion(val, errores, pos):
    try:
        return int(val)
    except Exception as e:
        print(e)
        pos = f'({chr(65+pos[1])}, {str(pos[0]+2)})'
        errores.append({'tipo': 'Error de formato en sección',
                        'detalle': f'{val} en posicion {pos}'})
        return 0  # error de formato


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
    periodo = parse_periodo(xls[0][1], errores, [0, 1])
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
                codigo, nombre = parse_curso(val, errores, [i, j])
                curso['codigo'] = codigo.strip()
                curso['nombre'] = nombre.strip()
                ref_curso += val
            elif keys[j] == '# Sem.':
                sem_malla = parse_semestre_malla(val, errores, [i, j])
                if sem_malla:
                    curso['semestre_malla'] = sem_malla
            elif keys[j] == 'Prof':
                profes = parse_profesores(val, errores, [i, j])
                if profes:
                    for p in profes:
                        if p == 'pendiente':
                            continue
                        curso['profesor'].append({'nombre': p})
                else:
                    errores[-1]['accion'] = f'{ref_curso} quedará sin profesores'
            elif keys[j] == 'Secc.':
                seccion = parse_seccion(val, errores, [i, j])
                if seccion:
                    curso['seccion'] = seccion
                    ref_curso += f' seccion {val}'
                else:
                    errores[-1]['accion'] = f'{ref_curso} queda sin sección. No se puede continuar sin esto!'
            else:
                if type(val) is float:
                    # Para identificar celdas vacias. Evaluaciones sin fecha.
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


def validar_semestre_excel(sem, file_stream):
    año = sem.año
    periodo = sem.periodo
    try:
        read_xls = pd.read_excel(file_stream.file, index_col=None)
    except Exception:
        return False, {'Error de formato': 'el archivo entregado no tiene el formato correcto o está corrupto.'}
    xls = read_xls.to_numpy()
    año_xls = int(read_xls.to_csv(index=False).split(',')[1])
    periodo_xls = xls[0][1]
    if año != año_xls:
        return False, {'error en año': f'el año del excel ({año_xls}) no coincide con el año del semestre al cual desea cargar evaluaciones ({año}).'}
    if periodo != periodo_xls:
        return False, {'error en periodo': f'el periodo del excel ({periodo_xls}) no coincide con el periodo del semestre al cual desea cargar evaluaciones ({periodo}).'}
    return True, []
