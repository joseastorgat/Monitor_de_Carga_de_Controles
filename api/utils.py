from api.models import Semestre, Ramo, Profesor, Curso, Evaluacion


def create_full_semester(semester):
    sem = Semestre.objects.create(
        año=semester['year'], inicio=semester['start'], fin=semester['finish'], periodo=semester['period'], estado=3)
    for curso in semester["cursos"]:
        ramo = Ramo.objects.filter(codigo=curso['codigo'])
        if not ramo:
            ramo = Ramo.objects.create(
                nombre=curso['nombre_ramo'], codigo=curso['codigo'],
                semestre_malla=curso['semestre_malla'])
        else:
            ramo = ramo.get()
        print(ramo)
        curso_inst = Curso.objects.create(
            ramo=ramo, semestre=sem, seccion=curso['seccion'])
        for profe in curso['profesor']:
            # profe_nombre, profe_apellido = profe['nombre'].replace(
            #     ' ', '').split('.')
            # profe_name = profe_nombre.capitalize()+'.' + \
            #     profe_apellido.capitalize()
            prof, prof_created = Profesor.objects.get_or_create(
                nombre=profe['nombre'])
            curso_inst.profesor.add(prof)
        for eval in curso['evaluaciones']:
            Evaluacion.objects.create(
                fecha=eval['fecha'], tipo=eval['tipo'], titulo=eval['titulo'],
                curso=curso_inst)
    print('listo')
