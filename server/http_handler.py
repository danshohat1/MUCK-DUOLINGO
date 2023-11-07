import json
from route_handler import *
VERSION = "HTTP/1.1"
from urllib.parse import unquote

class Http_Handler():
    def __init__(self, client_socket):
        self.client_socket = client_socket
        self.client_request = self.client_socket.recv(1024).decode()
        print(self.client_request)
        self.validate_http_request()



    def generate_friendly_request(self):
        ret = self.client_request.split("\r\n")
        print(ret[0].split() + [ret[-1]])
        return ret, self.generate_friendly_details(ret[0].split() + [ret[-1]])

    def generate_friendly_details(self, details):
        return {
                    "method": details[0],
                    "route": details[1] + "_" + details[0].lower() if details[1].find("?") == -1 else details[1].split("?")[0] + "_" + details[0].lower(),
                    "version": details[2],
                    "data": json.loads(details[3]) if details[0] == "POST" or details[0] == "PUT" or details[0] == "DELETE" else None,
                    "query_params":  self.extract_query_params(details[1])
                }

    def extract_query_params(self, route):
        # Extract query parameters from the route
        # Assuming the query parameter is in the format "?username={username}"
        query_params = []
        query_start_index = route.find("?")
        if query_start_index != -1:
            query_string = route[query_start_index + 1:]
            query_params = [unquote(param.split("=", 1)[1].strip()) for param in query_string.split("&") if
                            "=" in param]
        return query_params

    def validate_http_request(self):
        request_list, details = self.generate_friendly_request()
        if details["route"] not in route_map:
            self.send("Page not found sucker", "404 Not Found")
            return
        elif details["version"] != "HTTP/1.1":
            return False

        if details["data"] is None:
            if details["query_params"]:

                msg, status = route_map[details["route"]](*details["query_params"])
            else:
                msg, status = route_map[details["route"]]()
        else:
            if details["query_params"]:
                msg, status = route_map[details["route"]](*(tuple(details["query_params"]) + tuple(value for value in details["data"].values())))
            else:
                msg, status = route_map[details["route"]](*tuple(value for value in details["data"].values()))
        self.send(msg, status)

    def send(self, msg, status):
        msg = json.dumps(msg)
        if self.client_request.startswith("OPTIONS"):
            status = "200 OK"
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

        # Check if this is a preflight request (OPTIONS) and handle it.
        if self.client_request.startswith("OPTIONS"):
            # Respond to preflight request with minimal headers.
            self.client_socket.send(response.encode())
        else:
            # Handle regular request by sending the response message.
            response += "\r\n"
            response += msg
            self.client_socket.send(response.encode())

