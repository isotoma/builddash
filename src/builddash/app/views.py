# Create your views here.
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.utils import simplejson as json

import urllib
import time
from datetime import datetime

import builddash.settings as settings

from builddash.app.models import Message

def view(request):
    
    data = urllib.urlopen(settings.BUILDBOT_URL + '/json').read()
    loaded_data = json.loads(data)
    
    categories = {}
    for k,z in loaded_data['builders'].iteritems():
        
        category = z['category']
        if isinstance(category, dict):
            continue
        if not categories.has_key(category) :
            categories[category] = {'state': '', 'builders': {}, }
        
        if z['cachedBuilds']:
            last_build_number = z['cachedBuilds'][-1:][0]
            build_info = urllib.urlopen(settings.BUILDBOT_URL + '/json/builders/' + k + '/builds/' + str(last_build_number)).read()
            parsed_build_info = json.loads(build_info)
            if parsed_build_info['text']:
                status = parsed_build_info['text'][0]
            else:
                status = 'building'
            if len(parsed_build_info['text']) > 1:
                text = ''.join(parsed_build_info['text'][1:])
                
            time_finish_build =time.strftime("%d-%m-%y %H:%M", time.localtime(parsed_build_info['times'][1]))
            
            if z['state'] == 'building':
                categories[category]['state'] = 'building'
            if status == 'exception' and categories[category]['state'] != 'building':
                categories[category]['state'] = status
            elif status == 'failed' and categories[category]['state'] != 'exception' and categories[category]['state'] != 'building':
                categories[category]['state'] = status
            elif status == 'build' and categories[category]['state'] != 'failed' and categories[category]['state'] != 'exception' and categories[category]['state'] != 'building':
                categories[category]['state'] = status
                
            categories[category]['builders'][k] = {'status':status, 'time': time_finish_build}
                
            

    
    seperated_cats = {'building': [], 'build': [], 'failed': [], 'exception': []}
    
    for c in categories.keys():
        
        if categories[c]['state'] == 'building':
            seperated_cats['building'].append({c:categories[c]})
        if categories[c]['state'] == 'build':
            seperated_cats['build'].append({c:categories[c]})
        if categories[c]['state'] == 'failed':
            seperated_cats['failed'].append({c:categories[c]})
        if categories[c]['state'] == 'exception':
            seperated_cats['exception'].append({c:categories[c]})
            
    
    categories_to_send = json.dumps(seperated_cats)
    
    return HttpResponse(categories_to_send)

def get_messages(request):
    
    messages = Message.objects.filter(show = True).filter(expiry_time__gt = datetime.now()) | Message.objects.filter(show = True).filter(expiry_time = None)
    
    message_texts = [message.message for message in messages]
    messages_to_send = json.dumps(message_texts)
    
    return HttpResponse(messages_to_send)
    