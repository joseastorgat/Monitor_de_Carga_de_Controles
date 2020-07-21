from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework import status
from rest_framework.serializers import ValidationError

import datetime

from .models import Semestre, Ramo, Curso, Profesor, Calendario,\
    Fechas_especiales, Evaluacion, Semana
from api.serializers import SemestreSerializer, RamoSerializer,\
    CursoSerializer, ProfesorSerializer, CalendarioSerializer,\
    FechaSerializer, EvaluacionSerializer, CursoDetailSerializer,\
    SemestreFileSerializer, SemestreClonarSerializer,\
    NuevoCalendarioSerializer, SemanaSerializer

from rest_framework.views import APIView
from django.http import Http404
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.parsers import FormParser, MultiPartParser

from api.parser import parse_excel, validar_semestre_excel
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

    @action(detail=True, methods=['get'],
            # permission_classes=[permissions.IsAuthenticatedOrReadOnly]
            )
    def semanas(self, request, pk=None):
        # print(request.query_params)
        semanas = Semana.objects.filter(semestre=pk)
        serializer = SemanaSerializer(semanas, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'],
            serializer_class=SemestreClonarSerializer)
    def clonar(self, request, pk=None):
        # print(request.query_params)
        serializer = SemestreClonarSerializer(data=request.data)
        if serializer.is_valid():
            new_sem, errors = clonar_semestre(serializer.validated_data)
            if errors:
                return Response(errors, status=status.HTTP_206_PARTIAL_CONTENT)
            else:
                serializer_sem = SemestreSerializer(new_sem)
                return Response(serializer_sem.data, status=status.HTTP_201_CREATED)
        return Response({'status': 'info no valida :C'}, status=status.HTTP_400_BAD_REQUEST)

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

    def from_xlsx_std(self, func_creator, data, pk=None):
        try:
            serializer = SemestreFileSerializer(data=data)
            if serializer.is_valid():
                bin_file = data['file']
                if pk:
                    sem = Semestre.objects.filter(pk=pk).get()
                    valid, errors = validar_semestre_excel(sem, bin_file)
                    if not valid:
                        errors['error'] = 'datos de semestre en el excel no coinciden con el semestre al cual se desea cargar la información.'
                        return errors, status.HTTP_406_NOT_ACCEPTABLE
                parsed = parse_excel(bin_file)
                pars, errs = parsed
                if errs:
                    return errs, status.HTTP_406_NOT_ACCEPTABLE
                response = func_creator(parsed)
                if response['status_error']:
                    return response['status'], status.HTTP_500_INTERNAL_SERVER_ERROR
                if response['status_warning']:
                    return response, status.HTTP_412_PRECONDITION_FAILED
                return response, status.HTTP_201_CREATED
            else:
                return serializer.errors, status.HTTP_400_BAD_REQUEST
        except Exception as e:
            return {'Error no identificado':f'{e}'}, status.HTTP_500_INTERNAL_SERVER_ERROR
            

    @action(detail=False,
            methods=['POST'],
            serializer_class=SemestreFileSerializer,
            permission_classes=[],  # [permissions.IsAuthenticatedOrReadOnly],
            )
    def from_xlsx(self, request, *args, **kwargs):
        '''
        Crear semestre mediante archivo excel xlsx
        '''
        response, status = self.from_xlsx_std(
            create_full_semester, request.data)
        return Response(response, status=status)

    @action(detail=False,
            methods=['POST'],
            serializer_class=SemestreFileSerializer,
            permission_classes=[],  # [permissions.IsAuthenticatedOrReadOnly],
            )
    def from_xlsx2(self, request, *args, **kwargs):
        '''
        Crear semestre mediante archivo excel xlsx
        '''
        response, status = self.from_xlsx_std(
            add_courses_to_semester, request.data)
        return Response(response, status=status)

    @action(detail=True,
            methods=['POST'],
            serializer_class=SemestreFileSerializer,
            permission_classes=[],  # [permissions.IsAuthenticatedOrReadOnly],
            )
    def from_xlsx3(self, request, pk, *args, **kwargs):
        '''
        Crear semestre mediante archivo excel xlsx
        '''
        response, status = self.from_xlsx_std(
            add_evals_to_semester, request.data, pk)
        return Response(response, status=status)


class EvaluationViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Evaluations to be viewed or edited.
    """
    queryset = Evaluacion.objects.all()
    serializer_class = EvaluacionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            if e.detail['non_field_errors'][0].code == 'unique':
                return Response({'error': 'Ya hay una evaluación con este nombre'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response(e.detail, e.status)
        data = serializer.validated_data
        if Fechas_especiales.sin_feriado(data['fecha']):
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            return Response({'error': 'hay una fecha especial aqui'}, status=status.HTTP_401_UNAUTHORIZED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        if Fechas_especiales.sin_feriado(data['fecha']):
            self.perform_update(serializer)

            if getattr(instance, '_prefetched_objects_cache', None):
                instance._prefetched_objects_cache = {}

            return Response(serializer.data)
        else:
            return Response({'error': 'hay una fecha especial aqui'}, status=status.HTTP_401_UNAUTHORIZED)


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

    @action(detail=False, methods=['post'],
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
        data['cursos'] = request.data['cursos']
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
