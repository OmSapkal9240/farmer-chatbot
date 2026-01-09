from flask import Flask, request, send_file
from piper.voice import PiperVoice
import io

app = Flask(__name__)

# Download and load the voice model
voice = PiperVoice.from_huggingface("rhasspy/piper-voices", "en_US-lessac-medium")

@app.route('/tts', methods=['POST'])
def text_to_speech():
    text = request.json.get('text')
    if not text:
        return "Text not provided", 400

    # Synthesize speech
    audio_io = io.BytesIO()
    voice.synthesize(text, audio_io)
    audio_io.seek(0)

    return send_file(audio_io, mimetype='audio/wav')

if __name__ == '__main__':
    app.run(port=5001)
