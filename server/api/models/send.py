import json

class Send:
    
    @staticmethod
    def add_headers(func):
        def wrapper(**kwargs):
            response = f"HTTP/1.1 {kwargs['status']}\r\n"
            # Allow credentials if needed. Set this based on your application's requirements.
            response += "Access-Control-Allow-Credentials: true\r\n"

            # Set other CORS headers as needed, such as allowed methods and headers.
            response += "Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS\r\n"
            response += "Access-Control-Allow-Headers: Content-Type, Authorization\r\n"
            response += "Access-Control-Allow-Origin: http://localhost:3000\r\n"

            response += func(**kwargs)

            print(kwargs)

            kwargs["client_socket"].send(response.encode())

            return response
        return wrapper



    @staticmethod
    @add_headers
    def send(**kwargs):
        """Send the HTTP response to the client."""
        print(type(kwargs["msg"]))
        kwargs["msg"] = json.dumps(kwargs["msg"])

        response = f"Content-Length: {len(kwargs['msg'])}\r\n"
        response += "Content-Type: application/json\r\n"
        response += "\r\n"
        response += kwargs["msg"]
        return response
    
    @staticmethod
    @add_headers
    def send_options(**kwargs):
        """Handle an OPTIONS request by responding with CORS headers."""
        # Respond to the OPTIONS request with CORS headers
        return ""