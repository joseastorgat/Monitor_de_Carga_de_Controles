from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from api import serializers
from .models import *
from .serializers import RamoSerializers

@api_view(['GET'])
def apiOverview(request):
    api_urls={
        'Lista de ramos' : '/lista-ramos/'
    }
    return Response(api_urls)

@api_view(['GET'])
def RamoList(request):
    Ramos = Ramo.objects.all()
    serializer= RamoSerializers(Ramos, many=True)
    return Response(serializer.data)

class EvaluationViewSet(viewsets.ModelViewSet):
    queryset = Evaluacion.objects.all()
    serializer_class = serializers.EvaluacionSerializers
