# Generated by Django 2.2.8 on 2020-06-19 19:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ramo',
            name='semestre_malla',
            field=models.IntegerField(choices=[(15, 'Electivo'), (5, 'Quinto'), (6, 'Sexto'), (7, 'Septimo'), (8, 'Octavo'), (9, 'Noveno'), (10, 'Decimo')]),
        ),
    ]
