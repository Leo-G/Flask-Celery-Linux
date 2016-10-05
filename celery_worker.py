from app import celery, create_app

app = create_app('config')
app.app_context().push()