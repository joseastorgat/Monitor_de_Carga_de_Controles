from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework import status

import datetime

from .models import Semestre, Ramo, Curso, Profesor, Calendario,\
    Fechas_especiales, Evaluacion
from api.serializers import SemestreSerializer, RamoSerializer,\
    CursoSerializer, ProfesorSerializer, CalendarioSerializer,\
    FechaSerializer, EvaluacionSerializer, CursoDetailSerializer,\
    SemestreFileSerializer, SemestreClonarSerializer,\
    NuevoCalendarioSerializer

from rest_framework.views import APIView
from django.http import Http404
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.parsers import FormParser, MultiPartParser

from api.parser import parse_excel
from api.utils import create_full_semester, add_courses_to_semester,\
    add_evals_to_semester, clonar_semestre


class SemestreViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows semesters to be viewed or edited.
    """
    queryset = Semestre.objects.all()
    serializer_class = SemestreSerializer
    #permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=['get'],
            permission_classes=[permissions.IsAuthenticatedOrReadOnly])
    def cursos(self, request, pk=None):
        # print(request.query_params)
        cursos = Curso.objects.filter(semestre=pk)
        serializer = CursoDetailSerializer(cursos, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'],
            serializer_class=SemestreClonarSerializer)
    def clonar(self, request, pk=None):
        # print(request.query_params)
        serializer = SemestreClonarSerializer(data=request.data)
        if serializer.is_valid():
            clonar_semestre(serializer.validated_data)
            return Response({'status': 'clonado'})
        return Response({'status': 'info no valida :C'})

    @action(detail=True, methods=['get'],
            permission_classes=[permissions.IsAuthenticatedOrReadOnly])
    def fechas_especiales(self, request, pk=None):
        sem = Semestre.objects.get(pk=pk)
        inicio_sem = sem.inicio
        fin_sem = sem.fin
        fechas = Fechas_especiales.objects.filter(inicio__lte=fin_sem)
        fechas = fechas.filter(fin__gte=inicio_sem)
        serializer = FechaSerializer(fechas, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'],
            permission_classes=[permissions.IsAuthenticatedOrReadOnly])
    def evaluaciones(self, request, pk=None):
        evaluaciones = Evaluacion.objects.filter(curso__semestre=pk)
        serializer = EvaluacionSerializer(evaluaciones, many=True)
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

    @action(detail=False,
            methods=['POST'],
            serializer_class=SemestreFileSerializer,
            permission_classes=[],  # [permissions.IsAuthenticatedOrReadOnly],
            parser_classes=[
                FormParser,
                MultiPartParser,
            ]
            )
    def from_xlsx(self, request, *args, **kwargs):
        '''
        Crear semestre mediante archivo excel xlsx
        '''
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            bin_file = request.data['file']
            parsed = parse_excel(bin_file)
            response = create_full_semester(parsed)
            print(response)
            # ver bien el response a dar
            return Response(response)
        else:
            print(serializer.errors)
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False,
            methods=['POST'],
            serializer_class=SemestreFileSerializer,
            permission_classes=[],  # [permissions.IsAuthenticatedOrReadOnly],
            parser_classes=[
                FormParser,
                MultiPartParser,
            ]
            )
    def from_xlsx2(self, request, *args, **kwargs):
        '''
        Crear semestre mediante archivo excel xlsx
        '''
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            bin_file = request.data['file']
            parsed = parse_excel(bin_file)
            response = add_courses_to_semester(parsed)
            print(response)
            # ver bien el response a dar
            return Response(response)
        else:
            print(serializer.errors)
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False,
            methods=['POST'],
            serializer_class=SemestreFileSerializer,
            permission_classes=[],  # [permissions.IsAuthenticatedOrReadOnly],
            parser_classes=[
                FormParser,
                MultiPartParser,
            ]
            )
    def from_xlsx3(self, request, *args, **kwargs):
        '''
        Crear semestre mediante archivo excel xlsx
        '''
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            bin_file = request.data['file']
            parsed = parse_excel(bin_file)
            response = add_evals_to_semester(parsed)
            print(response)
            # ver bien el response a dar
            return Response(response)
        else:
            print(serializer.errors)
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)


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
                value = 1 if value == "otoño" else (
                    2 if value == "primavera" else 0)
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
    #permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=False, methods=['post'],
            #permission_classes=[permissions.IsAuthenticatedOrReadOnly],
            serializer_class=NuevoCalendarioSerializer)
    def auto_token(self, request, *args, **kwargs):
        while True:
            token = Calendario.new_token()
            if Calendario.objects.filter(token=token):
                continue
            break
        data = {}
        data['token'] = token
        data['fecha_creacion'] = str(datetime.date.today())
        data['nombre'] = request.data['nombre']
        data['cursos'] =  request.data['cursos']
        serializer = CalendarioSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class FechasEspecialesViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Fechas especiales to be viewed or edited.
    """
    queryset = Fechas_especiales.objects.all()
    serializer_class = FechaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
