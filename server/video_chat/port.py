import socket
from typing import Type

# Import the IP enumeration from the 'enums' module
from .enums import IP

class Port:
    def __new__(cls: Type['Port'], start_port: int) -> 'Port':
        """
        Create a new Port instance, ensuring it represents an open port.

        Parameters:
        - start_port (int): The starting port to begin searching.

        Returns:
        - Port: An instance of the Port class with an open port.
        """
        instance = super(Port, cls).__new__(cls)
        instance.port = start_port

        # Iterate until an open port is found
        while not cls.is_port_open(instance.port):
            instance.port += 1

        return instance

    @staticmethod
    def is_port_open(port: int) -> bool:
        """
        Check if a given port is open.

        Parameters:
        - port (int): The port number to check.

        Returns:
        - bool: True if the port is open, False otherwise.
        """
        try:
            # Attempt to bind a socket to the specified port
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(5)
            sock.bind((IP.WILDCARD.value, port))
            sock.close()
            return True
        except:
            return False
    
    def __repr__(self) -> str:
        """
        Return a string representation of the Port instance.
        """
        return f"Port({self.port})"
