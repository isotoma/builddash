from django.db import models

# Create your models here.

class MainCache(models.Model):
    time_stamp = models.DateTimeField()
    json = models.TextField()

class BuilderCache(models.Model):
    parent = models.ForeignKey(MainCache)
    json = models.TextField()
    builder = modelsTextField()

