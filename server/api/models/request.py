
import socket 
from ..enums import HttpMethod
import json
from typing import List, Dict, Any
from urllib.parse import unquote


class Request:
    def __init__(self, client_socket: socket.socket) -> None:
        """Initialize the HTTP handler with the client socket, receive and decode the client's request, and validate it."""
        self.__client_socket = client_socket
        self.__client_request = self.__client_socket.recv(1024).decode()

        self.details = self.generate_friendly_request()
    
    def generate_friendly_request(self) -> Dict[str, Any]:
        """Split the raw HTTP request into a list and generate a user-friendly request with details."""
        ret = self.__client_request.split("\r\n")
        print(ret[0].split() + [ret[-1]])
        return self.generate_friendly_details(ret[0].split() + [ret[-1]])

    def generate_friendly_details(self, details: List[str]) -> Dict[str, Any]:

        print(f"here {details}")

        """Generate friendly details from the parsed request details."""
        return {
            "method": HttpMethod.get_method(details[0]),
            "path": details[1] if details[1].find("?") == -1 else details[1].split("?")[0],
            "version": details[2],
            "data": json.loads(details[3]) if details[0] == "POST" else {},
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
    
    def __repr__(self):
        return self.details

    

    
