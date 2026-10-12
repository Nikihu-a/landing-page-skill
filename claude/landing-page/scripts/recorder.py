# Dev-only: serve the site without caching and accept captured frames.
import functools, http.server, os, sys, urllib.parse
ROOT, OUT = sys.argv[2], sys.argv[3]
class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()
    def log_message(self, *a): pass
    def do_GET(self):
        u = urllib.parse.urlparse(self.path)
        if u.path == "/__capture.js":
            body = open(os.path.join(os.path.dirname(__file__), "capture.js"), "rb").read()
            return self._send(body, "application/javascript")
        if u.path in ("/", "/index.html") and "capture" in u.query:
            html = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()
            html = html.replace("<body", '<script src="/__capture.js"></script><body', 1)
            return self._send(html.encode(), "text/html; charset=utf-8")
        return super().do_GET()
    def _send(self, body, ctype):
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
    def do_POST(self):
        q = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
        n = int(self.headers.get("Content-Length", 0))
        data = self.rfile.read(n)
        with open(os.path.join(OUT, f"{int(q['i'][0]):05d}.jpg"), "wb") as f:
            f.write(data)
        self.send_response(204); self.end_headers()
http.server.ThreadingHTTPServer(("127.0.0.1", int(sys.argv[1])), functools.partial(H, directory=ROOT)).serve_forever()
