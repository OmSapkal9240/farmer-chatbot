// Piper TTS Web Worker
// This script runs in a background thread to avoid blocking the UI.

importScripts('onnxruntime-web.js');

let model = null;
let vocoder = null;
let config = null;

async function synthesize(text, language) {
    if (!model || !vocoder || !config) {
        self.postMessage({ status: 'error', output: 'Models not loaded.' });
        return;
    }

    // Basic language to voice mapping (can be expanded)
    const voiceMap = {
        en: 'en_US-lessac-medium',
        hi: 'en_US-lessac-medium', // Fallback
        mr: 'en_US-lessac-medium', // Fallback
    };
    const voiceKey = voiceMap[language] || 'en_US-lessac-medium';

    // This is a simplified synthesis process. A real implementation would involve
    // phonemization, which is complex and requires its own model.
    // For this demo, we'll simulate a successful audio generation.
    
    // Simulate network and processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // In a real scenario, the ONNX model would run here to produce audio data.
    // Since we cannot run the full pipeline without all phonemization models,
    // we will return a hardcoded silent WAV file for demonstration purposes.
    const base64Wav = 'UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAAABkYXRhAAAAAA==';
    const byteString = atob(base64Wav);
    const len = byteString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = byteString.charCodeAt(i);
    }
    const audioData = bytes.buffer;

    self.postMessage({ status: 'complete', output: { audio: audioData } });
}

async function loadModels(language) {
    try {
        const voiceMap = {
            en: 'en_US-lessac-medium',
            hi: 'en_US-lessac-medium', // Fallback
            mr: 'en_US-lessac-medium', // Fallback
        };
        const voiceKey = voiceMap[language] || 'en_US-lessac-medium';

        const modelPath = `/piper/voices/${voiceKey}.onnx`;
        const configPath = `/piper/voices/${voiceKey}.onnx.json`;

        [model, config] = await Promise.all([
            ort.InferenceSession.create(modelPath),
            fetch(configPath).then(res => res.json()),
        ]);

        self.postMessage({ status: 'ready' });
    } catch (e) {
        self.postMessage({ status: 'error', output: e.message });
    }
}

self.addEventListener('message', async (event) => {
    if (model === null) {
        await loadModels(event.data.language);
    }
    synthesize(event.data.text, event.data.language);
});
