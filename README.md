# Instalar yarn
https://classic.yarnpkg.com/es-ES/docs/install/#windows-stable

# Luego realizar en carpeta frontend
npm install
yarn add react-bootstrap bootstrap
yarn add react-react-router-bootstrap
yarn add react-router-dom
npm install bootstrap

# Luego en carpeta MCC externa correr
## Crea ambiente
python -m venv env
source env/bin/activate

pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate

# Correr frontend
Ir a carpeta frontend desde consola
Poner yarn start
Ir a http://localhost:3000/

# Correr backend
python manage.py runserver
http://127.0.0.1:8000/api/