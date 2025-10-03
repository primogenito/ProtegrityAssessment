const synthesizer = globalThis.speechSynthesis;

export function syntheticVoice() {
    const voices = synthesizer.getVoices();

    if (voices) {

        const americanEnglishVoices = voices.filter(voice => voice.lang === "en-US")
            .filter(voice => voice.name.includes("Rocko") || voice.name.includes("Fred") || voice.default);

        return (americanEnglishVoices[0]);
    }
    
    return null;
}

/**
 * 
 * @param {string} text - String of text to speak
 * @returns {void}
 */
export function speak({text, endCallback, isPaused = false}) { 
    const voice = syntheticVoice();
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 1;
    utterance.pitch = 1.2;
    utterance.onerror = event => console.error(`
        There was an error when reading ${event.name} at time ${event.elapsedTime} seconds, error: ${event.error} 
    `);
    
    if (endCallback) {
        utterance.onend = endCallback;
    }

    if (voice) {
        utterance.voice = voice;
    }

    if (isPaused) {
        synthesizer.resume(); // Resume from same spot for current component
    }
    else {
        synthesizer.cancel(); // Clear audio from other components
        synthesizer.speak(utterance);
    }
}

/**
 * Pauses audio being read by the browser
 * 
 * @returns {void}
 */
export function pause() {
    synthesizer.pause();
}

/**
 * Stop reading and subsequent play starts from the beginning
 * 
 * @returns {void}
 */
export function stop() {
    synthesizer.cancel();
}