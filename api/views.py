from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from api import serializers
from .models import *
from .serializers import *

class SemestreViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows semesters to be viewed or edited.
    """
    queryset = Semestre.objects.all()
    serializer_class = SemestreSerializer
    #permission_classes = [permissions.IsAuthenticated]

# @api_view(['GET'])
# def apiOverview(request):
#     api_urls={
#         'Lista de ramos' : '/lista-ramos/'
#     }
#     return Response(api_urls)

# @api_view(['GET'])
# def RamoList(request):
#     Ramos = Ramo.objects.all()
#     serializer= RamoSerializer(Ramos, many=True)
#     return Response(serializer.data)

class EvaluationViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Evaluations to be viewed or edited.
    """
    queryset = Evaluacion.objects.all()
    serializer_class = EvaluacionSerializer

class RamoViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Ramos to be viewed or edited.
    """
    queryset = Ramo.objects.all()
    serializer_class = RamoSerializer

class CursoViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Cursos to be viewed or edited.
    """
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer

class ProfesorViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Profes to be viewed or edited.
    """
    queryset = Profesor.objects.all()
    serializer_class = ProfesorSerializer

class CalendarioViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Calendarios to be viewed or edited.
    """
    queryset = Calendario.objects.all()
    serializer_class = CalendarioSerializer

class FechasEspecialesViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Fechas especiales to be viewed or edited.
    """
    queryset = Fechas_especiales.objects.all()
    serializer_class = FechaSerializer


