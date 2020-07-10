from api.models import Semestre, Ramo, Profesor, Curso, Evaluacion

EVALS = 3
CURSOS = 2
FULL = 1


def create_semester(semester, level=EVALS):
    # response vacio, solo con warnings
    response = {'warning': []}
    response['prof status'] = []
    response['curso status'] = []
    response['ramos status'] = []
    try:
        if level == EVALS:
            response['eval status'] = []
        # verificar existencia se semestre
        sem = Semestre.objects.filter(
            año=semester['year'], periodo=semester['period'])
        if sem:
            if level == FULL:  # si se quiere crear un semestre totalmente nuevo, pero ya está.
                return {'status': 'Semestre ya existe en base de datos. ¿Desea \
completar un semestre ya existente?'}
            else:
                sem = sem.get()
        # sino, crear un semestre nuevo
        else:
            sem = Semestre.objects.create(
                año=semester['year'], inicio=semester['start'],
                fin=semester['finish'],
                periodo=semester['period'], estado=3)
        # ingresar cada curso al semestre
        for curso in semester["cursos"]:
            # hacer filtro por código de ramo, para evitar confución de nombre
            ramo = Ramo.objects.filter(codigo=curso['codigo'])
            if not ramo:
                # si el ramo no existe, se crea uno nuevo, se agrega al response
                ramo = Ramo.objects.create(
                    nombre=curso['nombre_ramo'], codigo=curso['codigo'],
                    semestre_malla=curso['semestre_malla'])
                response['ramos status'].append(f'{ramo} agregado a la base de datos de ramos.')
            else:
                ramo = ramo.get()
                response['ramos status'].append(f'{ramo.codigo} ya existe en la base de datos \
con el nombre {ramo}')
            print(ramo)
            # verificar existencia del curso
            curso_inst = Curso.objects.filter(
                ramo=ramo, semestre=sem, seccion=curso['seccion'])
            if curso_inst:
                # si curso ya existía en el semestre, se ignoran sus evaluaciones.
                # Se deja un warning.
                if level == CURSOS:
                    response['warning'].append(
                        f'curso {str(curso_inst.get())} ya existente, información \
no agregada.')
                    continue
                else:
                    curso_inst = curso_inst.get()
            else:
                curso_inst = Curso.objects.create(
                    ramo=ramo, semestre=sem, seccion=curso['seccion'])
                response['curso status'].append(f'{curso_inst}, agregado correctamente.')
            for profe in curso['profesor']:
                # profe_nombre, profe_apellido = profe['nombre'].replace(
                #     ' ', '').split('.')
                # profe_name = profe_nombre.capitalize()+'.' + \
                #     profe_apellido.capitalize()
                prof, prof_created = Profesor.objects.get_or_create(
                    nombre=profe['nombre'])
                if prof_created:
                    response['prof status'].append(f'{prof} no encontrado en base \
de datos, se ha agregado una nueva entrada para {prof}')
                curso_inst.profesor.add(prof)
            for eval in curso['evaluaciones']:
                eval_inst, eval_is_created = Evaluacion.objects.get_or_create(
                    fecha=eval['fecha'], tipo=eval['tipo'], titulo=eval['titulo'],
                    curso=curso_inst)
                if level == EVALS:
                    if eval_is_created:
                        response['eval status'].append(
                            f'{eval_inst} agregada correctamente')
                    else:
                        response['warning'].append(
                            f'{eval_inst} ya existente, no agregada')
        response['status'] = "Todo correcto!"
    except Exception as e:
        print(e)
        response['status'] = 'Error no identificado, se ha detenido\
 la carga del semestre en un punto indeterminado'
    return response
    # return {'status': 'Semestre creado!'}


def create_full_semester(semester):
    return create_semester(semester, level=FULL)


def add_courses_to_semester(semester):
    return create_semester(semester, level=CURSOS)


def add_evals_to_semester(semester):
    return create_semester(semester, level=EVALS)
