#!/usr/bin/env python3
"""Local preview for the static HResume UI.

Serves only the browser-facing files (HTML, css/, js/, images/, fonts/).
The Laravel app, README/SECURITY_REVIEW docs, dotfiles and .git are never
exposed. This is a development preview, not a deployment target.

    python3 tools/preview_server.py            # http://0.0.0.0:3000
    PORT=8080 python3 tools/preview_server.py
"""

import http.server
import mimetypes
import os
import socketserver
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PORT = int(os.environ.get("PORT", "3000"))

# Only these directories and root-level file suffixes are served.
ALLOWED_DIRS = ("css", "js", "images", "fonts")
ALLOWED_ROOT_SUFFIXES = (".html",)
ALLOWED_ROOT_FILES = {"site.webmanifest"}

EXTRA_TYPES = {
    ".js": "text/javascript",
    ".css": "text/css",
    ".webmanifest": "application/manifest+json",
    ".webp": "image/webp",
    ".woff2": "font/woff2",
    ".woff": "font/woff",
}
for ext, mime in EXTRA_TYPES.items():
    mimetypes.add_type(mime, ext)


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def translate_path(self, path):
        # The site root is the landing page, never a directory listing.
        if path.split("?", 1)[0] in ("", "/"):
            return str(ROOT / "index.html")
        # Resolve the request against ROOT and refuse anything outside it.
        target = super().translate_path(path)
        rel = Path(target).resolve().relative_to(ROOT.resolve()) if Path(target).resolve().is_relative_to(ROOT.resolve()) else None
        if rel is None:
            return str(ROOT / "__blocked__")
        parts = rel.parts
        if not parts:
            return str(ROOT / "__blocked__")
        if any(part.startswith(".") for part in parts):
            return str(ROOT / "__blocked__")
        if parts[0] in ALLOWED_DIRS:
            return target
        if len(parts) == 1 and (parts[0] in ALLOWED_ROOT_FILES or parts[0].endswith(ALLOWED_ROOT_SUFFIXES)):
            return target
        return str(ROOT / "__blocked__")

    def send_head(self):
        # SimpleHTTPRequestHandler would list directories; block them instead.
        path = self.translate_path(self.path)
        if Path(path).is_dir():
            self.send_error(404, "Not found")
            return None
        return super().send_head()

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        self.send_header("X-Content-Type-Options", "nosniff")
        super().end_headers()

    def log_message(self, fmt, *args):
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


if __name__ == "__main__":
    with Server(("0.0.0.0", PORT), Handler) as httpd:
        print(f"HResume UI preview on http://0.0.0.0:{PORT} (root: {ROOT})", flush=True)
        httpd.serve_forever()
