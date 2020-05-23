import csv
import datetime
import pprint
from collections import defaultdict

def parse_csv(file):
    """
    retorna un diccionario con la siguiente estructura
    {
        "year": int,
        "period": int,
        "start": datetime.date,
        "finish": datetime.date,
        "cursos": [
            {
                "semestre_malla": int,
                "codigo": str,
                "nombre": str,
                "seccion": int,
                "profesor": [
                    {
                        "nombre": str,
                    },
                    ...
                ],
                "evaluaciones": [
                    {
                        "titulo": str,
                        "fecha": datetime.date,
                        "tipo": int,
                    },
                    ...
                ],
            },
            ...
        ],
    }
    """
    reader = csv.reader(file)
    semester = defaultdict(list)
    # se parsean los atributos del semestre
    semester["year"] = int(next(reader)[1])
    semester["period"] = int(next(reader)[1])
    semester["start"] = datetime.date(*map(int, next(reader)[1].split("/")[::-1]))
    semester["finish"] = datetime.date(*map(int, next(reader)[1].split("/")[::-1]))

    header = next(reader)  # saltarse el header
    # se parsean los cursos
    for row in reader:
        if not row[1].startswith("CC"):
            continue
        course = defaultdict(list)
        course["semestre_malla"] = int(row[0].split("°")[0])
        course["codigo"] = row[1].split(":")[0].strip()
        course["nombre_ramo"] = row[1].split(":")[1].strip()
        course["seccion"] = int(row[2])
        teachers = row[3].split("/")
        for t in teachers:
            teacher = {}
            teacher['nombre'] = t
            course["profesor"].append(teacher)
        #course["teacher"] = row[3].split("/")[0]  # me quedo solo con el primero porque por ahora los cursos tiene un puro profe en los modelos
        # se parsean las evaluaciones
        for i, (date, name) in enumerate(zip(row[4:16], header[4:16])):
            if not date:
                continue
            split = date.split("/")
            course["evaluaciones"].append({
                "titulo": name,
                "fecha": datetime.date(*map(int, split[::-1])),
                "tipo": ("Control" if "Control" in name else "Tarea"),#1 if i < 4 else 2,
            })
        #course["aux_description"] = row[16]
        semester["cursos"].append(course)

    # semestre tiene cursos,  cursos tienen evaluaciones

    return semester


# def main():
#     with open("./csv_data/SEND_THIS.csv", "r") as file:
#         semester = parse_csv(file)
#         pprint.pprint(semester)

# main()


# if __name__ == '__main__':
#     main()
