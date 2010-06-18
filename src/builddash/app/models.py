from django.db import models

# Create your models here.

class JSONCache(models.Model):
    """ Cache the JSON that we get from the buildbot server, and add a time """
    main_json = models.TextField()
    builders_json = models.TextField()
    retrieval_time = models.DateTimeField()