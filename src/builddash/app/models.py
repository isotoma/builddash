from django.db import models
from datetime import datetime

class Message(models.Model):
    """ A class for holding a devops message """
    message = models.TextField()
    expiry_time = models.DateTimeField(blank = True, null = True)
    show = models.BooleanField()
    
    def currently_showing(self):
        if not self.expiry_time and self.show:
            return True
        if self.expiry_time and self.expiry_time > datetime.now() and self.show:
            return True
        return False 