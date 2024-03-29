import socket
import threading
from .models.response import Response
from typing import Tuple

IP = "0.0.0.0"


class Server:
    def __init__(self, port: int):
        self.port = port

    def run(self):
        self.server_socket = self.initiate_server(self.port)
        threading.Thread(target=self.handle_clients).start()

    def initiate_server(self, port):
        """Create and configure the server socket."""
        # Create a socket using IPv4 and TCP
        server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        # Bind the socket to the specified IP address and port
        server_socket.bind((IP, port))
        server_socket.listen(100)

        # Return the configured server socket
        return server_socket

    def handle_clients(self):
        """Continuously accept and handle incoming client connections."""
        while True:
            try:
                conn, addr = self.server_socket.accept()
                clnt_thread = \
                    threading.Thread(target=self.handle_single_client,
                                     args=(conn, addr))
                clnt_thread.start()
            except Exception as e:
                print(f"Failed to accept a connection: {e}")
