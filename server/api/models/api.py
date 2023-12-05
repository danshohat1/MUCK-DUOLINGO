import json
from ..route_handler import *
from urllib.parse import unquote
from ..enums import HttpMethod, Statuses
from ..route import Route
import threading
from typing import List, Callable


VERSION = "HTTP/1.1"

class HttpHandler():
    def __init__(self, client_socket):
        """Initialize the HTTP handler with the client socket, receive and decode the client's request, and validate it."""
        self.client_socket = client_socket
        self.client_request = self.client_socket.recv(1024).decode()

        req_thread = threading.Thread(target= lambda: self.validate_http_request())

        req_thread.start()

    def generate_friendly_request(self):
        """Split the raw HTTP request into a list and generate a user-friendly request with details."""
        ret = self.client_request.split("\r\n")
        print(ret[0].split() + [ret[-1]])
        return ret, self.generate_friendly_details(ret[0].split() + [ret[-1]])

    def generate_friendly_details(self, details):
        """Generate friendly details from the parsed request details."""
        print(details[0])
        return {
            "method": HttpMethod.get_method(details[0]),
            "path": details[1] if details[1].find("?") == -1 else details[1].split("?")[0],
            "version": details[2],
            "data": json.loads(details[3]) if details[0] == "POST" else None,
            "query_params":  self.extract_query_params(details[1])
        }

    def extract_query_params(self, path: str) -> List[str]:
        """Extract query parameters from the path."""
        # Assuming the query parameter is in the format "?username={username}"
        query_params = []
        query_start_index = path.find("?")
        if query_start_index != -1:
            query_string = path[query_start_index + 1:]
            query_params = [unquote(param.split("=", 1)[1].strip()) for param in query_string.split("&") if
                            "=" in param]
        return query_params

    def validate_http_request(self):
        """Validate the HTTP request and handle it accordingly."""
        request_list, details = self.generate_friendly_request()

        if details["method"].value == "OPTIONS":
            self.handle_options_request()
            return

        print(details["path"], details["method"])
        route : List[Route] = list(filter(lambda route: route.path == details["path"] and route.method == details["method"], Route.all.keys()))
        print(f"routes: { route }")
        if route  == []:
            self.send("not found.", Statuses.NOT_FOUND.value)
            return 
        route = Route.all.get(route[0])

        if details["data"] is None:
            if details["query_params"]:
                msg, status = route(*details["query_params"])
            else:
                msg, status = route()
        else:
            if details["query_params"]:
                msg, status = route(*(tuple(details["query_params"]) + tuple(value for value in details["data"].values())))
            else:
                msg, status = route(*tuple(value for value in details["data"].values()))
        self.send(msg, status)

    def send(self, msg, status):
        """Send the HTTP response to the client."""
        msg = json.dumps(msg)

        response = f"HTTP/1.1 {status}\r\n"
        response += f"Content-Length: {len(msg)}\r\n"
        response += "Content-Type: application/json\r\n"

        # Set the allowed origin(s). Replace '*' with your actual allowed origin(s).

        # Allow credentials if needed. Set this based on your application's requirements.
        response += "Access-Control-Allow-Credentials: true\r\n"

        # Set other CORS headers as needed, such as allowed methods and headers.
        response += "Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS\r\n"
        response += "Access-Control-Allow-Headers: Content-Type, Authorization\r\n"
        response += "Access-Control-Allow-Origin: http://localhost:3000\r\n"
        response += "\r\n"
        response += msg
        print("sending")
        self.client_socket.send(response.encode())

    def handle_options_request(self):
        """Handle an OPTIONS request by responding with CORS headers."""
        # Respond to the OPTIONS request with CORS headers
        response = "HTTP/1.1 200 OK\r\n"
        response += "Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS\r\n"
        response += "Access-Control-Allow-Headers: Content-Type, Authorization\r\n"
        response += "Access-Control-Allow-Origin: http://localhost:3000\r\n"
        response += "\r\n"
        self.client_socket.send(response.encode())
