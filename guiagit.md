**Uso de Git para el proyecto U-Calendar**

bajar proyecto
~~~
$git clone https://USERNAME@bitbucket.org/pablotorresg/monitor-de-carga-de-controles.git
~~~
Crear una rama desde master para cada funcionalidad agregada,

Ejemplo:
~~~
$git branch forms-semestre
~~~
Agregar todos los cambios:
~~~
$git add .
~~~

Agregar algunos cambios:
~~~
$git add filename
$git add directory
~~~

Hacer commits de lo último agregado.

Para los commit tenemos 4 opciones:
- [ADD] agregar algo nuevo al código
- [DEL] eliminar algo de la version anterior del codigo
- [FIX] arreglar algun bug del código
- [CHG] change/update alguna cosa que ya estaba previamente implementada


Ejemplos: 
~~~
$git commit -m "[ADD] se agrega metodo x en y"
~~~
~~~
$git commit -m "[FIX] bug corregido al hacer login"
~~~

(más info en https://git-scm.com/docs/git-commit)

Una vez lista la rama con la implementación, hacer pull request de esa rama desde la página de bitbucket:
1. ingresar al proyecto en la pagina de bitbucket
2. ir a la opcion a la izquierda que dice Branches
3. Aqui aparecen las ramas disponibles, y una de las columnas dice Pull Request; hacer click en create.
4. En la parte superior aparecen la rama de origen y la de destino, seleccionar la rama actual hacia master.
5. Seleccionar un reviewer, para que haga un check en caso de ser necesario.
6. Seleccionar la opcion de cerrar la rama una vez mergeada, opcional pero buena idea.
7. Hacer click en Create pull request

(mas detalles en: https://confluence.atlassian.com/bitbucket/create-a-pull-request-to-merge-your-change-774243413.html)

El reviewer toma el pull request y lo revisa para verificar los cambios y que no tenga conflictos con la rama master. 

Si tiene conflictos, se arreglan en la rama que se quiere mergear a master y se actualiza, add->commit->push. 

Los cambios se actualizarán aunque esté hecho el pull request.

Para mas detalles ver sección para resolver conflictos.

Si no tiene conflicto se mergea a la rama master, borrando del repositorio la rama de origen del cambio (si es que se selecciono la opcion).

Como resolver conflictos:
(más info en https://medium.com/@MiguelCasas/diferencia-entre-git-rebase-y-git-merge-workshop-de-git-8622dedde2d7 )

-hacer un rebase de la rama master a la rama con conflictos o hacer un merge.

para hacer el merge:
1. hacer pull de master 
~~~
$git checkout master
$git pull
~~~
2. cambiarse a la rama que se quiere mergear( ej: rama cambio)
~~~
$git checkout cambio
$git merge master
~~~
y solucionar los conflictos uno a uno.

para rebase:

(https://help.github.com/es/enterprise/2.15/user/articles/resolving-merge-conflicts-after-a-git-rebase)

(https://help.github.com/es/github/using-git/using-git-rebase-on-the-command-line)

NOTA: rebase agrega todos los commits que tiene la rama indicada, a la rama actual; poniendolos antes que el primer commit hecho en la rama de los cambios. Se intenta emular que se sacó la rama actual desde la última versión de master.


otros:
~~~
git status: para ver el estado de los archivos
git stash: para guardar los cambios sin commitearlos, sirve para cambiarse de rama sin matar lo que ya se tiene.
git checkout otra-rama: cambiarse a la branch otra-rama
git branch -d nombre-rama: para eliminar una rama local (https://vabadus.es/blog/otros/trabajando-con-git-eliminar-ramas-locales-y-remotas)
git push origin nombre-rama --force: para pushear despues de un rebase, borra la lista de commits
~~~