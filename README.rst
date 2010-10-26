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
  ./configure
  python bootstrap.py --distribute --v 1.4.3
  bin/buildout
  copy src/builddash/settings.example to src/builddash/settings.py and edit as required
  bin/django syncdb
  bin/django runserver
  bin/test for running the tests

The buildout will create a wsgi file at bin/django.wsgi. This can then be used to host in a wsgi compliant webserver.
