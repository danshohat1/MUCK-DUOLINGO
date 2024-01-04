import json
import jwt
import datetime

class Send:
    
    @staticmethod
    def add_headers(func):
        def wrapper(**kwargs):

            origin = kwargs.get("origin", "*")
            if origin == "127.0.0.1":
                origin = "localhost"
            response = f"HTTP/1.1 {kwargs['status']}\r\n"
            response += "Access-Control-Allow-Credentials: true\r\n"
            response += "Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS\r\n"
            response += "Access-Control-Allow-Headers: Content-Type, Authorization\r\n"
            response += f"Access-Control-Allow-Origin: http://{origin}:3000\r\n"
            response += "Access-Control-Max-Age: 86400\r\n"
            response += func(**kwargs)

            kwargs["client_socket"].send(response.encode())

            return response
        return wrapper

    @staticmethod
    @add_headers
    def send(**kwargs):
        """Send the HTTP response to the client."""
        result = kwargs.get("msg", "No data provided")

        # Check if cookies are provided in the response
        cookies = kwargs.get("cookies", [])

        # If cookies are provided, set them in the response headers

        # Include the result in the JSON response
        if cookies:
            response_body = {
                "data": result,
                "cookies": cookies
            }
        else:
            response_body = result 
        json_response = json.dumps(response_body)
        response = f"Content-Length: {len(json_response)}\r\n"
        response += "Content-Type: application/json\r\n"
        response += "\r\n"
        response += json_response
        return response

    @staticmethod
    @add_headers
    def send_options(**kwargs):
        """Handle an OPTIONS request by responding with CORS headers."""
        return "options response"
