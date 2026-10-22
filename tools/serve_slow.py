#!/usr/bin/env python3
"""Static file server with a deliberately slow endpoint.

The slow endpoint lets a page delay its own `load` event, which gives a
headless browser screenshot time to capture asynchronously generated content.
"""
import os
import sys
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = sys.argv[1] if len(sys.argv) > 1 else "."
PORT = int(sys.argv[2]) if len(sys.argv) > 2 else 8100
DELAY = float(sys.argv[3]) if len(sys.argv) > 3 else 16.0

PNG = bytes.fromhex(
    "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4"
    "890000000a49444154789c63000100000500010d0a2db40000000049454e44ae426082"
)


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def do_GET(self):
        if self.path.startswith("/slow"):
            time.sleep(DELAY)
            self.send_response(200)
            self.send_header("Content-Type", "image/png")
            self.send_header("Content-Length", str(len(PNG)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(PNG)
            return
        super().do_GET()

    def log_message(self, *a):
        pass


if __name__ == "__main__":
    print(f"serving {ROOT} on {PORT} (slow endpoint delays {DELAY}s)")
    ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
