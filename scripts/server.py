#!/usr/bin/env python3
# encoding: utf-8

from http.server import HTTPServer, SimpleHTTPRequestHandler
import sys
import argparse

parser = argparse.ArgumentParser()

parser.add_argument("-p", "--port", type=int, default=8080)
parser.add_argument("-d", "--directory", default=".")

inputs = parser.parse_args()

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
      super().__init__(*args, directory=inputs.directory, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        return super(CORSRequestHandler, self).end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

httpd = HTTPServer(("localhost", inputs.port), CORSRequestHandler)
print('\x1b[32mServing directory %s on localhost:%d\x1b[0m' % (inputs.directory, inputs.port))
httpd.serve_forever()
