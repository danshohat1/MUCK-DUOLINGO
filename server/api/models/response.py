from .request import Request
from socket import socket
from typing import List, Tuple
from ..route import Route
from ..enums import Statuses
from .send import Send
from ..response_scheme import ResponseScheme
import warnings

AUTHORIZATION_REQUEST_PARAM = "authorization_key"

class Response(Request, Send):
    def __init__(self, client_socket: socket, addr: Tuple[str, int]):
        self.client_socket = client_socket
        self.origin = addr[0]
        super().__init__(client_socket)

        self.handle_http_request()


    def handle_http_request(self):
        """Validate the HTTP request and handle it accordingly."""

        if self.details["method"].value == "OPTIONS":
            self.send_options(client_socket = self.client_socket, status = Statuses.OK.value, origin = self.origin)
            return

        route : List[Route] = list(filter(lambda route: route.path == self.details["path"] and route.method == self.details["method"], Route.all.keys()))

        if route  == []:
            self.send("not found.", Statuses.NOT_FOUND.value)
            return 
        
        route = route[0]
        if route.authorization:
            key = [val for key, val in self.details["data"].items() if key.lower() == AUTHORIZATION_REQUEST_PARAM]

            if not key:
                raise Exception("Route with authorization must have an authorization key in the params")
            
            key = key[0]

            response = route.authorization.check_authorization(key)
            if response:
                self.send(client_socket = self.client_socket, msg = response.data, status = response.status.value, cookies = response.cookies, origin = self.origin)
                return 


        self.call_route(route)       

        
        

    def call_route(self, route):
        try: 
            route = Route.all.get(route)
            print(*(list(self.details["cookies"].values()) +self.details["query_params"] + [value for key, value in self.details["data"].items() if key.lower() != AUTHORIZATION_REQUEST_PARAM]))
            response = route(*(list(self.details["cookies"].values()) +self.details["query_params"] + [value for key, value in self.details["data"].items() if key.lower() != AUTHORIZATION_REQUEST_PARAM]))
            self.send(client_socket = self.client_socket, msg = response.data, status = response.status.value, cookies = response.cookies, origin = self.origin)
        except: 
            warnings.warn(f"{route.__name__} should return a ResponseScheme type", RuntimeWarning)

            response = ResponseScheme()
            self.send(client_socket = self.client_socket, msg = response.data, status = response.status.value, cookies = response.cookies, origin = self.origin)

