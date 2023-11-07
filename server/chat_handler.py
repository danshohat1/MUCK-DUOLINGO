chat_server_port = None
chat_server_running = False
peerjs_port = None

import subprocess
from chat_server import Chat_Server
import threading
import socket

class Chat_Handler:
    @staticmethod
    def find_available_port(start_port, max_attempts=10):
        for _ in range(max_attempts):
            try:
                with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
                    sock.settimeout(5)
                    sock.connect(("127.0.0.1", start_port))
            except:
                return start_port
            start_port += 1
        return None

    def create_chat(self, lang, start_port=5000):
        global chat_server_running
        global peerjs_port
        global chat_server_port

        available_port = self.find_available_port(start_port)
        peerjs_port = available_port
        t1 = threading.Thread(target=lambda: subprocess.run(f"peerjs --port {peerjs_port}", shell=True))
        t1.start()

        chat_server = Chat_Server(lang)
        chat_server_port = chat_server.port

        chat_server_running = True

    @staticmethod
    def get_peerjs_port():
        global peerjs_port
        return peerjs_port

    @staticmethod
    def get_chat_server_port():
        global chat_server_port
        return chat_server_port

    @staticmethod
    def get_chat_server_running():
        global chat_server_running
        return chat_server_running
