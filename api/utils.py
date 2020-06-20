from api.models import Semestre, Ramo, Profesor, Curso, Evaluacion


def create_full_semester(semester):
    sem = Semestre.objects.create(
        año=semester['year'], inicio=semester['start'], fin=semester['finish'], periodo=semester['period'], estado=3)
    for curso in semester["cursos"]:
        ramo, ramo_created = Ramo.objects.get_or_create(
            nombre=curso['nombre_ramo'], codigo=curso['codigo'],
            semestre_malla=curso['semestre_malla'])
        print(ramo)
        curso_inst = Curso.objects.create(
            ramo=ramo, semestre=sem, seccion=curso['seccion'])
        for profe in curso['profesor']:
            profe_nombre, profe_apellido = profe['nombre'].replace(
                ' ', '').split('.')
            profe_name = profe_nombre.capitalize()+'.' + \
                profe_apellido.capitalize()
            prof, prof_created = Profesor.objects.get_or_create(
                nombre=profe_name)
            curso_inst.profesor.add(prof)
        for eval in curso['evaluaciones']:
            Evaluacion.objects.create(
                fecha=eval['fecha'], tipo=eval['tipo'], titulo=eval['titulo'],
                curso=curso_inst)
    print('listo')
