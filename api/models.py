from django.db import models

año_actual = 2020


class Profesor(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre


class Semestre(models.Model):
    _PERIODOS = (
        (1, "Otoño"),
        (2, "Primavera"),
    )
    _ESTADOS = (
        (1, "Terminado"),
        (2, "En ejecucion"),
        (3, "Por comenzar"),
    )
    año = models.IntegerField(default=año_actual)
    inicio = models.DateField()
    fin = models.DateField()
    periodo = models.IntegerField(choices=_PERIODOS)
    estado = models.IntegerField(choices=_ESTADOS)

    def __str__(self):
        return "Semestre "+self._PERIODOS[self.periodo-1][1]+" " +\
            str(self.año)


class Ramo(models.Model):
    _SEMESTRES = (
        (15, "Electivo"),
        (5, "Quinto"),
        (6, "Sexto"),
        (7, "Septimo"),
        (8, "Octavo"),
        (9, "Noveno"),
        (10, "Decimo"),
    )

    nombre = models.CharField(max_length=45)
    codigo = models.CharField(max_length=45, default=0, primary_key=True)
    semestre_malla = models.IntegerField(choices=_SEMESTRES)

    def __str__(self):
        return self.nombre


class Curso(models.Model):
    ramo = models.ForeignKey(Ramo, on_delete=models.CASCADE)
    semestre = models.ForeignKey(Semestre, on_delete=models.CASCADE)
    seccion = models.IntegerField(default=0)
    profesor = models.ManyToManyField(Profesor)


class Evaluacion(models.Model):
    fecha = models.DateField()
    tipo = models.CharField(max_length=45)
    titulo = models.CharField(max_length=45)
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE)


class Fechas_especiales(models.Model):
    _TIPOS_FECHAS = (
        (1, "Feriado"),
        (2, "Vacaciones de Invierno"),
        (3, "Semana Olimpica"),
        (4, "Semana de Vacaciones"),
        (5, "Otros")

    )
    inicio = models.DateField()
    fin = models.DateField()
    nombre = models.CharField(max_length=45)
    tipo = models.IntegerField(choices=_TIPOS_FECHAS)


class Calendario(models.Model):
    fecha_creacion = models.DateField()
    nombre = models.CharField(max_length=45)
    token = models.CharField(max_length=45)
    # link = models.CharField(max_length=100)
    cursos = models.ManyToManyField(Curso)
