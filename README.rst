=========
builddash
=========

builddash is a simple, auto-refreshing dashboard for a buildbot instance.
The aim of the project is to create a dashboard that can be projected or otherwise displayed, and give instant feedback as to the state of the builds in a buildbot instance.
builddash is a fairly simple django wrapper around the JSON api provided by buildbot 0.8. The extra use of django allows for caching, and 'clever stuff'.

Assumptions
-----------

builddash assumes that all your builders in a buildbot project have a category set on them. This allows for much neater organisation, and better visual feedback as to the overall state of the project. Individual builders status is listed inside the category status.

Usage
-----

Clone, Configure, Run::
  git clone git://github.com/isotoma/builddash.git
  edit web/settings.py and point BUILDBOT_URL to your buildbot instance
  ./manage.py runserver 0.0.0.0:8000 to start an instance.

As the app is django, deployment can also be carried out in any wsgi compliant webserver, which is beyond the scope of this document. See the excellent django docs for instructions on how this can be carried out. A sample wsgi file for this project will be provided, once it has been created ;)
