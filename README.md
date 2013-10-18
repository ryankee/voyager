![voyager](https://raw.github.com/davidglivar/voyager/develop/lib/assets/voyager.png) voyager [![Build Status](https://travis-ci.org/davidglivar/voyager.png)](https://travis-ci.org/davidglivar/voyager)
===

This is a work in progress, please check back later.

Usage
-----

Install voyager globally.

    npm install -g voyager

To generate a new project

    voyager -n <project_name>
    cd <project_name>/
    npm install

Start your server

    voyager -s <port|3000>

Testing
-------

voyager uses [jasmine-node](https://github.com/mhevery/jasmine-node) for testing. Be sure to install it with `npm install -g jasmine-node`.

Run the voyager specs with

    voyager -t

Influences
----------

This project is heavily influenced by connect and express.