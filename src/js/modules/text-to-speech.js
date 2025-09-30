const synthesizer = globalThis.speechSynthesis;
const utterance = new SpeechSynthesisUtterance();

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
export function speak(text, isPaused = false) { 
    const voice = syntheticVoice();

    utterance.text = text;
    utterance.rate = 1;
    utterance.pitch = 1.2;

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