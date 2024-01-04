from .server import Server
from .route import Route
from .models import Response
from socket import socket 
from typing import Tuple
from .enums import HttpMethod
from typing import Optional
from .authorization import Authorization

DEFAULTPORT = 8000
class App(Server):
    
    def __init__(self, port: int = DEFAULTPORT):
        
        super().__init__(port)
        self.routes = {}


    def route(self, method: HttpMethod = HttpMethod.GET, path: str = "/", authorization: Optional[Authorization] = None):
        def wrapper(func):
            route = Route(func, method, path, authorization)
            self.routes[route] = route.func
        return wrapper

    def handle_single_client(self, client: socket, addr: Tuple[str, int]) -> None:
        """Handle a single client connection by creating an instance of the Http_Handler class."""
        # Create an instance of the Http_Handler class to handle HTTP requests from the client
        Response(self, client, addr)


        