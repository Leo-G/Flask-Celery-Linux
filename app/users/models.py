from marshmallow_jsonapi import Schema, fields
from marshmallow import validate
from app.basemodels import db, CRUD_MixIn


class Users(db.Model, CRUD_MixIn):
    id = db.Column(db.Integer, primary_key=True)

    email = db.Column(db.String(250), nullable=False, unique=True)
    password = db.Column(db.String(250), nullable=False)
    name = db.Column(db.String(250), nullable=False)
    active = db.Column(db.Boolean, nullable=False)
    creation_time = db.Column(
        db.TIMESTAMP, server_default=db.func.current_timestamp(), nullable=False)
    modification_time = db.Column(
        db.TIMESTAMP)
    role = db.Column(db.String(250), db.ForeignKey('roles.name'))
    # many users to one  role
    role_relation = db.relationship('Roles', backref="users")

    def __init__(self,  email,  password,  name,  active,  role):

        self.email = email
        self.password = password
        self.name = name
        self.active = active
        self.role = role


class UsersSchema(Schema):

    not_blank = validate.Length(min=1, error='Field cannot be blank')
    # add validate=not_blank in required fields
    id = fields.Integer(dump_only=True)

    email = fields.Email(validate=not_blank)
    password = fields.String(validate=not_blank)
    name = fields.String(validate=not_blank)
    active = fields.Boolean()
    creation_time = fields.DateTime(dump_only=True)
    modification_time = fields.DateTime(dump_only=True)
    role = fields.String(validate=not_blank)

    # self links
    def get_top_level_links(self, data, many):
        if many:
            self_link = "/users/"
        else:
            self_link = "/users/{}".format(data['id'])
        return {'self': self_link}

    class Meta:
        type_ = 'users'
