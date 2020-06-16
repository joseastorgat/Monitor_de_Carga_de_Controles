from rest_framework import serializers
from .models import Semestre, Ramo, Curso, Profesor, Calendario,\
    Fechas_especiales, Evaluacion, Semana


class SemestreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semestre
        fields = '__all__'


class RamoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ramo
        fields = '__all__'


class CursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curso
        fields = '__all__'


class ProfesorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profesor
        fields = '__all__'


class CursoDetailSerializer(serializers.ModelSerializer):
    nombre = serializers.SerializerMethodField(read_only=True)
    semestre_malla = serializers.SerializerMethodField(read_only=True)
    profesor = serializers.SlugRelatedField(queryset=Profesor.objects.all(),
                                            slug_field='nombre', many=True)

    def get_semestre_malla(self, obj):
        return obj.ramo.semestre_malla

    def get_nombre(self, obj):
        return obj.ramo.nombre

    class Meta:
        model = Curso
        fields = ['id', 'ramo', 'nombre', 'semestre_malla', 'profesor', ]


class CalendarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calendario
        fields = '__all__'


class FechaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fechas_especiales
        fields = '__all__'


class EvaluacionSerializer(serializers.ModelSerializer):
    semana = serializers.SerializerMethodField(read_only=True)
    dia = serializers.SerializerMethodField(read_only=True)

    def get_semana_obj(self, obj):
        current = obj.fecha
        semana = Semana.objects.filter(inicio__lte=current)
        semana = semana.filter(fin__gte=current)
        return semana

    def get_semana(self, obj):
        semana = self.get_semana_obj(obj)
        if semana:
            semana = semana.get()
            return semana.numero
        return None

    def get_dia(self, obj):
        fecha = obj.fecha
        return fecha.weekday()
    
    class Meta:
        model = Evaluacion
        fields = ['id', 'fecha', 'tipo', 'titulo', 'curso', 'semana', 'dia']



# class Calendario_CursoSerializers(serializers.ModelSerializer):
#     class Meta:
#         model=Calendario_Curso
#         fields='__all__'

# class Curso_ProfesorSerializers(serializers.ModelSerializer):
#     class Meta:
#         model=Curso_Profesor
#         fields='__all__'
