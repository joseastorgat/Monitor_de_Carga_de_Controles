from django.urls import path, include

from rest_framework import routers
from api import views

router = routers.DefaultRouter()

router.register(r'semestres', views.SemestreViewSet)
router.register(r'ramos', views.RamoViewSet)
router.register(r'evaluaciones', views.EvaluationViewSet)
router.register(r'cursos', views.CursoViewSet)
router.register(r'profesores', views.ProfesorViewSet)
router.register(r'calendario', views.CalendarioViewSet)
router.register(r'fechas-especiales', views.FechasEspecialesViewSet)

urlpatterns = [
    path('api/', include((router.urls, 'api'))),
]
