from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework import status

from .models import Semestre, Ramo, Curso, Profesor, Calendario,\
                    Fechas_especiales, Evaluacion
from api.serializers import SemestreSerializer, RamoSerializer,\
        CursoSerializer, ProfesorSerializer, CalendarioSerializer,\
        FechaSerializer, EvaluacionSerializer, CursoDetailSerializer

from rest_framework.views import APIView
from django.http import Http404
from rest_framework.decorators import action
from rest_framework.request import Request


class SemestreViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows semesters to be viewed or edited.
    """
    queryset = Semestre.objects.all()
    serializer_class = SemestreSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=['get'],
            permission_classes=[permissions.IsAuthenticatedOrReadOnly])
    def cursos(self, request, pk=None):
        # print(request.query_params)
        cursos = Curso.objects.filter(semestre=pk)
        serializer = CursoDetailSerializer(cursos, many=True)
        return Response(serializer.data)

    def get_queryset(self):
        if self.request.query_params:
            params = self.request.query_params
            try:
                semestre = self.apply_filters(params, model_class=Semestre)
                return semestre
            except Exception:
                pass
        return super().get_queryset()
    
    def apply_filters(self, params, model_class):
        model = model_class.objects
        for i, ftr in enumerate(params.items()):
            print(ftr)
            model = model.filter(ftr)
        return model.filter()


    # @action(detail=False, methods=['get'],
    #         permission_classes=[permissions.IsAuthenticatedOrReadOnly],
    #         url_path='')
    # def por_año(self, request, pk):
    #     '''
    #     Semestres por fecha
    #     '''
    #     print(request.query_params)
    #     # usar los params para calcular la fecha
    #     cursos = Curso.objects.filter(semestre__año=pk)
    #     serializer = CursoSerializer(cursos, many=True)
    #     return Response(serializer.data)


class EvaluationViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Evaluations to be viewed or edited.
    """
    queryset = Evaluacion.objects.all()
    serializer_class = EvaluacionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class RamoViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Ramos to be viewed or edited.
    """
    queryset = Ramo.objects.all()
    serializer_class = RamoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=['get'],
            permission_classes=[permissions.IsAuthenticatedOrReadOnly])
    def cursos(self, request, pk=None):
        cursos = Curso.objects.filter(ramo=pk)
        serializer = CursoSerializer(cursos, many=True)
        return Response(serializer.data)


class CursoViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Cursos to be viewed or edited.
    """
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=['get'],
            permission_classes=[permissions.IsAuthenticatedOrReadOnly])
    def evaluaciones(self, request, pk=None):
        cursos = Evaluacion.objects.filter(curso=pk)
        print(cursos)
        serializer = EvaluacionSerializer(cursos, many=True)
        print(serializer.data)
        return Response(serializer.data)

    def get_queryset(self):
        if self.request.query_params:
            params = self.request.query_params
            try:
                cursos = self.apply_filters(params, model_class=Curso)
                return cursos
            except Exception:
                pass
        return super().get_queryset()

    def apply_filters(self, params, model_class):
        model = model_class.objects
        for i, ftr in enumerate(params.items()):
            print(ftr)
            if 'semestre' in ftr:
                key, value = ftr
                ftr = ('semestre__año', value)
            elif 'periodo' in ftr:
                key, value = ftr
                # Otoño = 1, Primavera=2
                value = value.lower()
                value = 1 if value == "otoño" else (2 if value == "primavera" else 0)
                if value == 0:
                    raise Exception
                ftr = ('semestre__periodo', value)
            model = model.filter(ftr)
        return model.filter()

    # def retrieve(self, request, pk, *args, **kwargs):
    #     # instance = self.get_object()
    #     instance = Curso.objects.filter(id=pk).get()
    #     print(pk)
    #     print(instance)

    #     serializer = self.get_serializer(instance)
    #     # serializer = CursoDetailSerializer(instance)
    #     return Response(serializer.data)

    @action(detail=False, methods=['get'],
            permission_classes=[permissions.IsAuthenticatedOrReadOnly])
    def detalle(self, request):
        cursos = self.get_queryset()
        print(cursos)
        serializer = CursoDetailSerializer(cursos, many=True)
        print(serializer.data)
        return Response(serializer.data)


class ProfesorViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Profes to be viewed or edited.
    """
    queryset = Profesor.objects.all()
    serializer_class = ProfesorSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'pk'


class CalendarioViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Calendarios to be viewed or edited.
    """
    queryset = Calendario.objects.all()
    serializer_class = CalendarioSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class FechasEspecialesViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Fechas especiales to be viewed or edited.
    """
    queryset = Fechas_especiales.objects.all()
    serializer_class = FechaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
