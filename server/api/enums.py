from enum import Enum


class Statuses(Enum):
    OK = "200 OK"
    NOT_FOUND = "404 Not Found"
    UNAUTHORIZED = "403 Unauthorized"

class HttpMethod(Enum):
    GET = "GET"
    POST = "POST"
    PUT = "PUT"
    DELETE = "DELETE"
    OPTIONS = "OPTIONS"

    def get_method(method:str) -> "HttpMethod":
        print(method)
        return next(_method for _method in HttpMethod if _method.value == method.upper())
    

    

