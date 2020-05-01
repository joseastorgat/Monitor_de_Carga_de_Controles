from rest_framework import serializers
from .models import *

class SemestreSerializers(serializers.ModelSerializer):
    class Meta:
        model=Semestre
        fields='__all__'

class RamoSerializers(serializers.ModelSerializer):
    class Meta:
        model=Ramo
        fields='__all__'

class CursoSerializers(serializers.ModelSerializer):
    class Meta:
        model=Curso
        fields='__all__'

class ProfesorSerializers(serializers.ModelSerializer):
    class Meta:
        model=Ramo
        fields='__all__'

class CalendarioSerializers(serializers.ModelSerializer):
    class Meta:
        model=Calendario
        fields='__all__'

class MallaSerializers(serializers.ModelSerializer):
    class Meta:
        model=Malla
        fields='__all__'

class FechaSerializers(serializers.ModelSerializer):
    class Meta:
        model=Fechas_especiales
        fields='__all__'

class EvaluacionSerializers(serializers.ModelSerializer):
    class Meta:
        model=Evaluacion
        fields='__all__'

class Calendario_CursoSerializers(serializers.ModelSerializer):
    class Meta:
        model=Calendario_Curso
        fields='__all__'

class Curso_ProfesorSerializers(serializers.ModelSerializer):
    class Meta:
        model=Curso_Profesor
        fields='__all__'