Fluid
=====

Static website with blog engine.

Requirements
============

Node.js (version 0.10.26) and coffee-script (version 1.8.*). Only linux and Mac supported.

Installation
============

Clone or decompress the project folder.
Run
> npm install
> grunt

Configuration
=============

Create a setenv.sh file at the root directory of Fluid and set the shell variables DB and PORT.
DB is a the full standard URI such as mongodb://<user>:<password>@<ip>:<port>/<db>.
PORT is the port number to be used and will overwrite the default port number (5000).

Start Server
============

Start
> npm start

Stop
> npm stop

Version History
===============

v0.0.1 quick and dirty base

Roadmap
=======

- improve administration views (menu items, categories, etc)
- search posts by category and tags.
- better handle views and components such as menu, presentation elements, etc.
