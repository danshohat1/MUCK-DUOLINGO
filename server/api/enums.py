from enum import Enum


class Statuses(Enum):
    OK = "200 OK"

class HttpMethods(Enum):
    GET = "GET"
    POST = "POST"
    PUT = "PUT"
    DELETE = "DELETE"
    OPTIONS = "OPTIONS"

    def get_method(method:str) -> "HttpMethods":
        return next(_method for _method in HttpMethods if _method.value == method.upper())
    

    

