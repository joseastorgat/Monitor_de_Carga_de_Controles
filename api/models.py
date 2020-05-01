from django.db import models

# Create your models here.

class Profesor(models.Model):
    nombre=models.CharField(max_length=100)

    def __str__(self):
        return self.nombre

class Semestre(models.Model):
    _PERIOD_TYPES = (
        (1, "Otoño"),
        (2, "Primavera"),
    )
    _STATE_TYPES = (
        (1, "Terminado"),
        (2, "En ejecucion"),
        (3, "Por comenzar"),
    )
    año=models.DateField()
    inicio=models.DateField()
    fin=models.DateField()
    tipo=models.IntegerField(choices=_PERIOD_TYPES)
    #estado=models.BooleanField(defaul=False)
    estado=models.IntegerField(choices=_STATE_TYPES)

class Malla(models.Model):
    _SEMESTERS = (
        (5, "Quinto"),
        (6, "Sexto"),
        (7, "Septimo"),
        (8, "Octavo"),
        (9, "Noveno"),
        (10, "Decimo"),
    )
    #Semestre=models.CharField(max_length=45)
    n_Semestre=models.IntegerField(choices=_SEMESTERS)
    id_ramo=models.ForeignKey('Ramo', on_delete=models.CASCADE)

class Ramo(models.Model):
    title=models.CharField(max_length=45)
    codigo=models.CharField(max_length=45,default=0)

    def __str__(self):
        return self.title

class Curso(models.Model):
    ramo_asociado=models.ForeignKey('Ramo', on_delete=models.CASCADE)
    semestre_asociado=models.ForeignKey('Semestre', on_delete=models.CASCADE)
    seccion=models.IntegerField(default=0)
    descripcion=models.CharField(max_length=45)
## No se si en curso agregar al profesor o crear tabla profesor

class Evaluacion(models.Model):
    fecha=models.DateField()
    tipo=models.CharField(max_length=45)
    titulo=models.CharField(max_length=45)
    curso_asociado=models.ForeignKey('Curso', on_delete=models.CASCADE)


class Fechas_especiales(models.Model):
    _FECHAS_TYPES = (
        (1, "Feriados"),
        (2, "Vacaciones"),
        (3, "Otros"),
    )
    inicio = models.DateField()
    fin = models.DateField()
    nombre=models.CharField(max_length=45)
    tipo=  models.IntegerField(choices=_FECHAS_TYPES)

class Curso_Profesor(models.Model):
    profe=models.ForeignKey('Profesor', on_delete=models.CASCADE)
    curso=models.ForeignKey('Curso', on_delete=models.CASCADE)

class Calendario(models.Model):
    fecha_creacion=models.DateField()
    nombre=models.CharField(max_length=45)
    token=models.CharField(max_length=45)
    link=models.CharField(max_length=100)

class Calendario_Curso(models.Model):
    id_calendario=models.ForeignKey('Calendario', on_delete=models.CASCADE)
    id_curso=models.ForeignKey('Curso', on_delete=models.CASCADE)
    id_semestre=models.ForeignKey('Semestre', on_delete=models.CASCADE)

