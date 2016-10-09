from flask import Flask
from celery import Celery
from config import CELERY_BROKER_URL

celery = Celery(__name__, broker=CELERY_BROKER_URL)


# http://flask.pocoo.org/docs/0.10/patterns/appfactories/


def create_app(config_filename):
    app = Flask(__name__, static_folder='templates/static')
    app.config.from_object(config_filename)

    # Init Flask-SQLAlchemy
    from app.basemodels import db
    db.init_app(app)

    celery.conf.update(app.config)

    from app.users.views import users
    app.register_blueprint(users, url_prefix='/api/v1/users')

    from app.baseviews import login_required, login1, mail
    from flask import render_template, send_from_directory
    import os

    # Init Flask-Mail
    mail.init_app(app)

    @app.route('/login')
    def login():
        return render_template('login.html')

    @app.route('/<path:filename>')
    def file(filename):
        return send_from_directory(os.path.join(app.root_path, 'templates'), filename)

    @app.route('/')
    def index():
        return render_template('index.html')

    # Auth API
    app.register_blueprint(login1, url_prefix='/api/v1/')

    from app.roles.views import roles
    app.register_blueprint(roles, url_prefix='/api/v1/roles')

    # Blueprints
    from app.commands.views import commands
    app.register_blueprint(commands, url_prefix='/api/v1/commands')

    return app
    
    


