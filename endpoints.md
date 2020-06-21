Lista de endpoints disponibles:

~~~
/api/cursos/?key=value&key2=value2&..../
/api/semestres/?key=value&key2=value2&..../
/api/semestres/< pk_semestre>/cursos/
/api/semestres/< pk_semestre>/evaluaciones/
/api/semestres/from_xlsx/
/api/cursos/< pk_curso >/evaluaciones/
/api/ramos/< codigo_ramo >/cursos/
/api/cursos/?semestre=<año>&periodo=<otoño o primavera>/
/api/cursos/detalle/?key=value.../
~~~

nota 1:

hacer
~~~
/api/ramos/< codigo_ramo >/cursos
~~~
es equivalente a
~~~
/api/cursos/?ramo=<codigo_ramo>
~~~

nota 2:

Ejemplos de uso de:
~~~
/api/cursos/?semestre=<año>&periodo=<otoño o primavera>
~~~
es:
~~~
api/cursos/?semestre=2019&periodo=primavera
api/cursos/?semestre=2019
api/cursos/?periodo=primavera
~~~
