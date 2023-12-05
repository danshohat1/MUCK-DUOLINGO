import socket
from typing import Self
from .enums import IP

class Port:
    def __new__(cls, start_port: int) -> Self:
        instance = super(Port, cls).__new__(cls)
        instance.port = start_port
        while not cls.is_port_open(instance.port):
            instance.port += 1
        return instance

    @staticmethod
    def is_port_open(port: int) -> bool:
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(5)
            sock.bind((IP.WILDCARD.value, port))
            sock.close()
            return True
        except:
            return False
    
    def __repr__(self) -> str:
        return f"Port({self.port})"
