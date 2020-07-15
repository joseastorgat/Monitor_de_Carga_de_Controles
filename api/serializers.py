from rest_framework import serializers
from .models import Semestre, Ramo, Curso, Profesor, Calendario,\
    Fechas_especiales, Evaluacion, Semana


class SemestreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semestre
        fields = '__all__'


class SemestreClonarSerializer(serializers.Serializer):
    año = serializers.IntegerField()
    inicio = serializers.DateField()
    fin = serializers.DateField()
    periodo = serializers.IntegerField()
    estado = serializers.IntegerField()
    from_año = serializers.IntegerField()
    from_periodo = serializers.IntegerField()


class SemestreFileSerializer(serializers.Serializer):
    file = serializers.FileField()

    def validate_file(self, file):
        # TODO: validar archivo
        return file


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
        fields = ['id', 'ramo', 'nombre', 'seccion',
                  'semestre_malla', 'profesor', ]


class CalendarioSerializer(serializers.ModelSerializer):
    semestre = serializers.SerializerMethodField(read_only=True)

    def get_semestre(self, obj):
        if obj.cursos.all():
            return obj.cursos.all()[0].semestre.pk
        return None

    class Meta:
        model = Calendario
        fields = ['token', 'fecha_creacion', 'nombre', 'cursos', 'semestre']


class NuevoCalendarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calendario
        fields = ['nombre', 'cursos']


class FechaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fechas_especiales
        fields = '__all__'


class EvaluacionSerializer(serializers.ModelSerializer):
    semana = serializers.SerializerMethodField(read_only=True)
    dia = serializers.SerializerMethodField(read_only=True)
    nombre_curso = serializers.SerializerMethodField(read_only=True)
    codigo = serializers.SerializerMethodField(read_only=True)
    seccion = serializers.SerializerMethodField(read_only=True)
    warning = serializers.SerializerMethodField(read_only=True)

    def get_seccion(self, obj):
        return obj.curso.seccion
    
    def get_warning(self, obj):
        fe = Fechas_especiales.objects.filter(inicio__lte=obj.fecha)
        fe = fe.filter(fin__gte=obj.fecha)
        if fe:
            return 'Evaluación sobre una fecha especial!'
        else:
            return None

    def get_semana_obj(self, obj):
        current = obj.fecha
        semana = Semana.objects.filter(inicio__lte=current)
        semana = semana.filter(fin__gte=current)
        semana = semana.filter(semestre=obj.curso.semestre)
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

    def get_nombre_curso(self, obj):
        return obj.curso.ramo.nombre

    def get_codigo(self, obj):
        return obj.curso.ramo.codigo

    class Meta:
        model = Evaluacion
        fields = ['id', 'fecha', 'tipo', 'titulo', 'curso',
                  'seccion', 'nombre_curso', 'codigo', 'semana', 'dia', 'warning']
