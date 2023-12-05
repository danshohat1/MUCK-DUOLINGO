import subprocess
from video_chat.chat_server import ChatServer
import threading
from .port import Port


chat_server_port = None
chat_server_running = False
peerjs_port = None


class ChatHandler:
    def create_chat(self, lang: str, start_port=5000) -> None:
        """Create a new chat with the specified language"""
        global chat_server_running
        global peerjs_port
        global chat_server_port

        # Find an available port for PeerJS server
        peerjs_port = Port(start_port).port

        # Start the PeerJS server in a separate thread
        command = f"peerjs --port {peerjs_port}"
        func = lambda: subprocess.run(command, shell=True)
        t1 = threading.Thread(target= func)
        t1.start()

        # Create and start the Chat Server
        chat_server = ChatServer(lang)
        chat_server_port = chat_server.port

        # Set the flag indicating that the chat server is running
        chat_server_running = True

    @staticmethod
    def get_peerjs_port() -> int:
        """Get the port on which the PeerJS server is running."""
        global peerjs_port
        return peerjs_port

    @staticmethod
    def get_chat_server_port() -> int:
        """Get the port on which the Chat Server is running."""
        global chat_server_port
        return chat_server_port

    @staticmethod
    def get_chat_server_running() -> bool:
        """Check if the Chat Server is running."""
        global chat_server_running
        return chat_server_running
