from flask import Blueprint, request, jsonify, make_response
from app.commands.models import Commands, CommandsSchema
from flask_restful import Api
from app.baseviews import Resource
from app.basemodels import db
from sqlalchemy.exc import SQLAlchemyError
from marshmallow import ValidationError
import subprocess
from app import celery

commands = Blueprint('commands', __name__)
# http://marshmallow.readthedocs.org/en/latest/quickstart.html#declaring-schemas
# https://github.com/marshmallow-code/marshmallow-jsonapi
schema = CommandsSchema(strict=True)
api = Api(commands)

@celery.task
def run_command(command):
    cmd = subprocess.Popen(command,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
    stdout,error = cmd.communicate()
    return {"result":stdout, "error":error}

# Commands


class CreateListCommands(Resource):
    """http://jsonapi.org/format/#fetching
    A server MUST respond to a successful request to fetch an individual resource or resource collection with a 200 OK response.
    A server MUST respond with 404 Not Found when processing a request to fetch a single resource that does not exist, except when the request warrants a 200 OK response with null as the primary data (as described above)
    a self link as part of the top-level links object"""

    def get(self):
        commands_query = Commands.query.all()
        results = schema.dump(commands_query, many=True).data
        return results

    """http://jsonapi.org/format/#crud
    A resource can be created by sending a POST request to a URL that represents a collection of commands. The request MUST include a single resource object as primary data. The resource object MUST contain at least a type member.
    If a POST request did not include a Client-Generated ID and the requested resource has been created successfully, the server MUST return a 201 Created status code"""

    def post(self):
        raw_dict = request.get_json(force=True)
        try:
            schema.validate(raw_dict)
            request_dict = raw_dict['data']['attributes']
            cmd = request_dict['name']
            task = run_command.delay(cmd.split()) 
            task_id = task.id
            task_status = run_command.AsyncResult(task_id)
            task_state = task_status.state
            result  =   str(task_status.info)
            command = Commands(request_dict['name'], task_id,  task_state,  result)
            command.add(command)
            # Should not return password hash
            query = Commands.query.get(command.id)
            results = schema.dump(query).data
            return results, 201

        except ValidationError as err:
            resp = jsonify({"error": err.messages})
            resp.status_code = 403
            return resp

        except SQLAlchemyError as e:
            db.session.rollback()
            resp = jsonify({"error": str(e)})
            resp.status_code = 403
            return resp


class GetUpdateDeleteCommand(Resource):

    """http://jsonapi.org/format/#fetching
    A server MUST respond to a successful request to fetch an individual resource or resource collection with a 200 OK response.
    A server MUST respond with 404 Not Found when processing a request to fetch a single resource that does not exist, except when the request warrants a 200 OK response with null as the primary data (as described above)
    a self link as part of the top-level links object"""

    def get(self, id):
        command_query = Commands.query.get_or_404(id)
        result = schema.dump(command_query).data
        return result

    """http://jsonapi.org/format/#crud-updating"""

    def patch(self, id):
        command = Commands.query.get_or_404(id)
        
        try:
            
            task_id = command.task_id
            task_status = run_command.AsyncResult(task_id)
            command.status = task_status.state
            command.result = str(task_status.info)          
            command.update()
            return self.get(id)

        except ValidationError as err:
            resp = jsonify({"error": err.messages})
            resp.status_code = 401
            return resp

        except SQLAlchemyError as e:
            db.session.rollback()
            resp = jsonify({"error": str(e)})
            resp.status_code = 401
            return resp

    # http://jsonapi.org/format/#crud-deleting
    # A server MUST return a 204 No Content status code if a deletion request
    # is successful and no content is returned.
    def delete(self, id):
        command = Commands.query.get_or_404(id)
        try:
            delete = command.delete(command)
            response = make_response()
            response.status_code = 204
            return response

        except SQLAlchemyError as e:
            db.session.rollback()
            resp = jsonify({"error": str(e)})
            resp.status_code = 401
            return resp


api.add_resource(CreateListCommands, '.json')
api.add_resource(GetUpdateDeleteCommand, '/<int:id>.json')
