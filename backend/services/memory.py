_sessions = {}

def get_session_memory(session_id):
    return _sessions.get(session_id, [])

def save_message(session_id, role, text):
    if session_id not in _sessions:
        _sessions[session_id] = []
    _sessions[session_id].append({"role": role, "text": text})

def format_memory_for_prompt(history):
    return "\n".join(
        f"{m['role'].upper()}: {m['text']}" for m in history[-6:]
    )
