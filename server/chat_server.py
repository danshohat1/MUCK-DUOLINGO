import eventlet
import socketio
import socket

from server_data import PORT, IP
import threading

LOCALHOST = "127.0.0.1"
START_PORT = 3000

groups = {

}
class Chat_Server:

    global sio, app
    sio = socketio.Server(cors_allowed_origins = "*")
    app = socketio.WSGIApp(sio)

    def __init__(self, chat_lang):
        self.lang = chat_lang

        self.port = self.check_open_port(START_PORT)
        print("in server")
        print(f"chat server is running at port {self.port}, updating chats")


        run = threading.Thread(target= lambda: eventlet.wsgi.server(eventlet.listen((IP, self.port)), app))
        run.start()

        self.check()

    @staticmethod
    def is_port_open(port):
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(5)
            sock.bind(("0.0.0.0", port))
            sock.close()
            return True
        except:
            return False
       


    def check_open_port(self, start_port):

        while not self.is_port_open(start_port):
            start_port += 1

        return start_port

    def check(self):

        @sio.event()
        def new_connection(sid, lang):
            if lang in groups.keys():

                for user_sid in groups[lang]:
                    sio.emit("user_connected", sid, room = user_sid)

                groups[lang].append(sid)
            else:
                groups[lang] = [sid]



        @sio.event
        def disconnect(sid):
            print(f"user disconnected: {sid}")

            # find the sid in the groups object
            user_lang = [lang for lang, sids in groups.items() for user_sid in sids if user_sid == sid][0]

            for user_sid in groups[user_lang]:
                    if user_sid != sid:
                        sio.emit("user_disconnected", sid, room = user_sid)

            groups[user_lang].remove(sid)

        @sio.event
        def peer(sid, target_sid, id):
            sio.emit("peer", {"user_id": id, "sender_sid": sid}, room = target_sid)
            print("peer sent to " + target_sid)

        @sio.event
        def get_peer_id(sid, target_sid, id):
            print(id)
            sio.emit("get_peer_id", {"peer_id": id, "sender_sid": sid}, room=target_sid)
            print("peer sent to " + target_sid)

