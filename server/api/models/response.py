from .request import Request
from socket import socket
from typing import List
from ..route import Route
from ..enums import Statuses
from .send import Send

class Response(Request, Send):

    def __init__(self, client_socket: socket):
        self.client_socket = client_socket
        super().__init__(client_socket)

        self.validate_http_request()


    def validate_http_request(self):
        """Validate the HTTP request and handle it accordingly."""

        print(self.details)
        if self.details["method"].value == "OPTIONS":
            self.send_options(client_socket = self.client_socket, status = Statuses.OK.value)
            return

        print(self.details["path"], self.details["method"])
        route : List[Route] = list(filter(lambda route: route.path == self.details["path"] and route.method == self.details["method"], Route.all.keys()))
        print(f"routes: { route }")

        if route  == []:
            self.send("not found.", Statuses.NOT_FOUND.value)
            return 
        route = Route.all.get(route[0])


        msg, status = route(*(tuple(self.details["query_params"]) + tuple(value for value in self.details["data"].values())))
    
        print(type(msg))
        self.send(client_socket = self.client_socket, msg = msg, status = status)