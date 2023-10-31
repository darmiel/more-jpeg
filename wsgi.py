from api import app

from werkzeug.middleware.proxy_fix import ProxyFix

if __name__ == "__main__":
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)
    app.run()