from django.db import models

class Message(models.Model):
    """ A class for holding a devops message """
    message = models.TextField()
    expiry_time = models.DateTimeField()
    show = models.BooleanField()