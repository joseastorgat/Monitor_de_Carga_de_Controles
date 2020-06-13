## Instalar NodeJS
https://nodejs.org/es/download/

## Instalar yarn
https://classic.yarnpkg.com/es-ES/docs/install/#windows-stable

## Luego realizar en carpeta frontend
- npm install
- npm install bootstrap
- npm install @primer/octicons-react --save
- yarn add react-bootstrap bootstrap
- yarn add react-router-bootstrap
- yarn add react-router-dom


## Luego en carpeta MCC externa
### Crear ambiente
- python -m venv env
- source env/bin/activate

### Luego
- pip install -r requirements.txt
- python manage.py makemigrations
- python manage.py migrate

## Correr frontend
Ir a carpeta frontend desde consola
- Poner yarn start
- Ir a http://localhost:3000/

## Correr backend
python manage.py runserver
- Ir a http://127.0.0.1:8000/api/

### Algunos detalles en Windows
Si no es posible realizar activate y solicita cambiar la política de ejecución, aquí está la solución:
https://stackoverflow.com/questions/18713086/virtualenv-wont-activate-on-windows