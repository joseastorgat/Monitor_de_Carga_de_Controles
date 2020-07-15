from django.db import models
from django.utils.crypto import get_random_string
import datetime

año_actual = 2020


class Profesor(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

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

    class Meta:
        unique_together = (('año', 'periodo'))

    def __str__(self):
        return "Semestre "+self._PERIODOS[self.periodo-1][1]+" " +\
            str(self.año)

    def save(self, *args, **kwargs):
        super(Semestre, self).save(*args, **kwargs)
        semanas = {}
        one_day = datetime.timedelta(days=1)
        current = self.inicio
        dia_inicio = self.inicio
        counter = 0
        week_counter = 1
        while current <= self.fin:
            print(current)
            if current.weekday() == 6:
                key = (dia_inicio, current)
                dia_inicio = current+one_day
                semanas[key] = week_counter
                week_counter += 1
            current += one_day
            counter += 1
        for s in semanas:
            if self.semana_valida(s):
                print(f'semana {semanas[s]} es válida!')
                inicio, fin = s
                if Semana.objects.filter(numero=semanas[s], semestre=self):
                    continue
                Semana.objects.create(
                    numero=semanas[s], semestre=self, inicio=inicio, fin=fin)
        print('guardando semestre! :D',
              f'{counter} días en semestre, dia inicio {dia_inicio}')
        print(semanas)
        return

    def semana_valida(self, semana_tuple):
        dia_inicio, dia_fin = semana_tuple
        dias_lectivos = [0, 1, 2, 3, 4]
        # procesar semana con fechas especiales
        current = dia_inicio
        one_day = datetime.timedelta(days=1)
        # ver bien el sgte ciclo
        while current <= dia_inicio:
            dia_semana = current.weekday()
            fechas = Fechas_especiales.objects.filter(fin__gte=current)
            fechas = fechas.filter(inicio__lte=current)
            if len(fechas):
                dias_lectivos.remove(dia_semana)
            current += one_day
        if dias_lectivos:
            return True
        return False


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

    def __str__(self):
        return f'{self.ramo.codigo}-{self.seccion} {str(self.semestre)}'

    class Meta:
        unique_together = (("ramo", "semestre", "seccion"))


class Evaluacion(models.Model):
    fecha = models.DateField()
    tipo = models.CharField(max_length=45)
    titulo = models.CharField(max_length=45)
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE)

    def __str__(self):
        return f'Evaluación: {self.titulo} {self.curso}'

    class Meta:
        unique_together = (("titulo", "curso"))


class Semana(models.Model):
    numero = models.IntegerField()
    semestre = models.ForeignKey(Semestre, on_delete=models.CASCADE)
    inicio = models.DateField()
    fin = models.DateField()
    fechas_especiales = models.ManyToManyField('Fechas_especiales')

    class Meta:
        unique_together = (("numero", "semestre"))

    def validar(self):
        dias_lectivos = [0, 1, 2, 3, 4]
        one_day = datetime.timedelta(days=1)
        for fecha_especial in self.fechas_especiales.all():
            current_day = fecha_especial.inicio
            while current_day <= self.fin and\
                    current_day <= fecha_especial.fin:
                dia_semana = current_day.weekday()
                print(dia_semana)
                if dia_semana < 5 and fecha_especial.is_restrictive():
                    print(dias_lectivos)
                    try:
                        dias_lectivos.remove(dia_semana)
                    except Exception:
                        print('error, dia de la semana ya fue removido \
                            anteriormente')
                    print(dias_lectivos)
                current_day += one_day
            if len(dias_lectivos) == 0:
                # chequear bien este cambio de numeros
                # debuggear esta parte!!
                numero = self.numero
                self.numero = 0
                self.save()
                print(numero, self.numero)
                semanas = Semana.objects.filter(numero__gt=numero)
                semanas = semanas.filter(semestre=self.semestre)
                print(semanas)
                for sem in semanas:
                    print(sem.numero)
                    sem.numero -= 1
                    print(sem.numero)
                    sem.save()
                return False
            return True
        return True

        # for fecha in self.fechas_especiales.all():
        #     dia_semana = fecha.fecha.weekday()
        #     print(dia_semana)
        #     if dia_semana < 5 and fecha.tipo:
        #         print(dias_lectivos)
        #         try:
        #             dias_lectivos.remove(dia_semana)
        #         except Exception:
        #             pass
        #         print(dias_lectivos)


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
    # fecha = models.DateField()
    nombre = models.CharField(max_length=45)
    tipo = models.IntegerField(choices=_TIPOS_FECHAS)

    def save(self, *args, **kwargs):
        super(Fechas_especiales, self).save(*args, **kwargs)
        # fecha = self.fecha
        fecha_inicio = self.inicio
        fecha_fin = self.fin
        semanas = Semana.objects.filter(inicio__lte=fecha_fin)
        semanas = semanas.filter(fin__gte=fecha_inicio)
        for semana in semanas:
            # semana = semana.get()
            semana.fechas_especiales.add(self)
            if semana.validar() is False:
                semana.delete()

    def is_restrictive(self):
        # ver bien los casos aqui
        # definir que tipos de fechas
        # especiales remueven dias
        # del semestre y cuales no 
        return True

    def __str__(self):
        return f'{self.nombre}'


class Calendario(models.Model):
    fecha_creacion = models.DateField()
    nombre = models.CharField(max_length=45)
    token = models.CharField(max_length=45, default=0, primary_key=True)
    cursos = models.ManyToManyField(Curso)

    @staticmethod
    def new_token():
        return get_random_string(length=40)
