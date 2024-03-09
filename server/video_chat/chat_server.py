import eventlet
import socketio
from .port import Port
from .enums import IP
import threading
from .group import Group

START_PORT = 3000
groups = {

}


class ChatServer:

    # Initialize the socket.io server and application
    global sio, app
    sio = socketio.Server(cors_allowed_origins="*")
    app = socketio.WSGIApp(sio)

    def __init__(self, chat_lang):
        """Initialize the Chat_Server"""
        self.lang = chat_lang

        # Find an open port and start the server on that port
        self.port = Port(START_PORT).port

        print(f"Chat server is running at port {self.port}, updating chats")

        # Create a thread to run the socket.io server

        run = threading.Thread(target=self.start_server)
        run.start()

        # Check for new connections
        self.check()

    def start_server(self):
        eventlet.wsgi.server(eventlet.listen((IP.WILDCARD.value, self.port)),
                             app)

    def check(self):
        """Define and handle socket.io events for new connections"""

        @sio.event()
        def new_connection(sid, lang):
            """Handle a new connection event."""

            group = Group.find_group(lang)
            if group:
                # Inform existing users in the group about the new user
                for user_sid in group.members:
                    sio.emit("user_connected", sid, room=user_sid)

                group += sid
            else:
                new_group = Group(lang)
                new_group += sid

        @sio.event
        def disconnect(sid):
            """Handle a disconnection event."""
            print(f"User disconnected: {sid}")

            # Find the language associated with the disconnected user

            user_group = [group for group in Group.all if sid in group][0]

            # Inform remaining users in the group
            for user_sid in user_group.members:
                if user_sid != sid:
                    sio.emit("user_disconnected", sid, room=user_sid)

            # Remove the disconnected user from the group
            user_group -= sid
            if len(user_group) == 0:
                print("here")
                Group.all.remove(user_group)

        @sio.event
        def peer(sid, target_sid, id, username):
            """Handle a peer communication event."""
            # Emit a 'peer' event to the target user with relevant details
            sio.emit("peer", {"user_id": id, "sender_sid": sid,
                              "username": username}, room=target_sid)
            print("Peer sent to " + target_sid)

        @sio.event
        def get_peer_id(sid, target_sid, id, username):
            """Handle a get peer ID event."""
            # Emit a 'get_peer_id' event to
            # the target user with relevant details
            sio.emit("get_peer_id", {"peer_id": id, "sender_sid": sid,
                                     "username": username}, room=target_sid)
            print("Peer sent to " + target_sid)
