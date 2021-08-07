from threading import Lock
from flask import Flask, render_template, session, request, \
    copy_current_request_context
from flask_socketio import SocketIO, emit, join_room, leave_room, \
    close_room, rooms, disconnect
import random
import string

# Set this variable to "threading", "eventlet" or "gevent" to test the
# different async modes, or leave it set to None for the application to choose
# the best option based on installed packages.
async_mode = None
cors_allowed_origins = "*"

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, async_mode=async_mode,
                    cors_allowed_origins=cors_allowed_origins)
thread = None
thread_lock = Lock()

previous_ids = {}
rooms = {}


def generate_random_string(size=6, chars=string.ascii_lowercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


def safe_join(id, roomId):
    if id in previous_ids:
        leave_room(previous_ids[id])

    join_room(roomId)
    print(f"Socket {id} joined room {roomId}")
    previous_ids[id] = roomId


def background_thread():
    """Example of how to send server generated events to clients."""
    count = 0
    while True:
        socketio.sleep(10)
        count += 1
        socketio.emit('my_response',
                      {'data': 'Server generated event', 'count': count})


@app.route('/')
def index():
    return render_template('index.html', async_mode=socketio.async_mode)


@socketio.event
def connect():
    global thread
    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(background_thread)


@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected', request.sid)


@socketio.on("room:join")
def on_room_join(room_id):
    room = rooms[room_id]
    if room_id not in rooms:
        return socketio.emit("room:content", {"status": 404})

    safe_join(request.sid, room_id)
    socketio.emit("room:content", {
        **room,
        "status": 2000
    })


@socketio.on("room:create")
def on_room_create():
    id = generate_random_string()
    room = {"id": id, "owner": request.sid, "content": ""}
    rooms[id] = room
    socketio.emit("room:create", {**room, "status": 200})


@socketio.on("room:editContent")
def on_room_edit_content(data):
    room_id = data["id"]
    new_content = data["content"]

    if room_id not in rooms:
        return

    room = rooms[room_id]

    if room["owner"] != request.sid:
        return

    rooms[room_id] = {**room, "content": new_content}
    socketio.emit("room:content", {
                  **rooms[room_id], "status": 200}, to=room_id)


if __name__ == '__main__':
    socketio.run(app, port=3001)
