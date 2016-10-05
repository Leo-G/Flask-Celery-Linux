from marshmallow_jsonapi import Schema, fields
from marshmallow import validate
from app.basemodels import db, CRUD_MixIn


class Commands(db.Model, CRUD_MixIn):
    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(250), nullable=False)
    task_id = db.Column(db.Text)
    status = db.Column(db.String(250))
    result = db.Column(db.Text)

    def __init__(self,  name,  task_id,  status,  result, ):

        self.name = name
        self.task_id = task_id
        self.status = status
        self.result = result


class CommandsSchema(Schema):

    not_blank = validate.Length(min=1, error='Field cannot be blank')
    # add validate=not_blank in required fields
    id = fields.Integer(dump_only=True)

    name = fields.String(validate=not_blank)
    task_id = fields.String(validate=not_blank)
    status = fields.String(validate=not_blank)
    result = fields.String(validate=not_blank)

    # self links
    def get_top_level_links(self, data, many):
        if many:
            self_link = "/commands/"
        else:
            self_link = "/commands/{}".format(data['id'])
        return {'self': self_link}

    class Meta:
        type_ = 'commands'
