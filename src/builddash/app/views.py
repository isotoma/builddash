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
        
        builder = k
        category = z['category']
        
        if z['cachedBuilds']:
            # there are previous builds
            last_build_number = z['cachedBuilds'][-1:][0]
            build_info = urllib.urlopen(settings.BUILDBOT_URL + 
                                        '/json/builders/' + k + '/builds/' + 
                                        str(last_build_number)).read()
            parsed_build_info = json.loads(build_info)
            
            if parsed_build_info['text']:
                last_build_status = parsed_build_info['text'][0]
            else:
                last_build_status = 'building'
            
            if len(parsed_build_info['text']) > 1:
                extra_text = ''.join(parsed_build_info['text'][1:])
            else:
                extra_text = ''
            
            finish_time = time.localtime(parsed_build_info['times'][1])
            time_finish_build = time.strftime("%Y-%m-%d %H:%M", finish_time)
            
            current_state = z['state']
            if len(z['pendingBuilds']):
                status = 'building'
            elif current_state in ['building','exception','failed','offline']:
                status = current_state
            else:
                status = last_build_status
            
            if current_state == 'offline' and status == 'building':
                status = 'offline'
            
            if status not in categories.keys():
                categories[status] = {'state': status,
                                      'builders': {},
                                     }
            categories[status]['builders'][k] = {'status': status,
                                                 'time': time_finish_build,
                                                 'category': category,
                                                 'builder': k,
                                                 'pending':len(z['pendingBuilds']),
                                                }
            
    
    separated_cats = {'building': [], 'offline': [], 'build': [], 'failed': [], 'exception': []}
    for c in categories.keys():
        state = categories[c]['state']
        if state in separated_cats.keys():
            builders = sorted(categories[c]['builders'].values(),
                              key=lambda k: k['time'], reverse=True)
            
            separated_cats[state].extend(builders)
    
    categories_to_send = json.dumps(separated_cats)
    
    return HttpResponse(categories_to_send)

def get_messages(request):
    
    messages = Message.objects.filter(show = True).filter(expiry_time__gt = datetime.now()) | Message.objects.filter(show = True).filter(expiry_time = None)
    
    message_texts = [message.message for message in messages]
    messages_to_send = json.dumps(message_texts)
    
    return HttpResponse(messages_to_send)
    
