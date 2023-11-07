
import socket
import threading
from server_data import *
from http_handler import Http_Handler

def main():
    Server()


class Server:
    def __init__(self):
        self.server_socket = self.initiate_server()
        self.handle_clients()


    def initiate_server(self):
        server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_socket.bind((IP, PORT))

        server_socket.listen(10)

        print(f"the server is running at port: {PORT}")

        return server_socket

    def handle_clients(self):
        while True:
            conn, addr = self.server_socket.accept()
            clnt_thread = threading.Thread(target=self.handle_single_client, args = (conn,))

            clnt_thread.start()

    def handle_single_client(self, client):
        client_http =   Http_Handler(client)
        

if __name__ == "__main__":
    main()
