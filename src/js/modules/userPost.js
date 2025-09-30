import { truncateText } from "./utilities.js";
import { speak, pause, stop } from "./text-to-speech.js";

const { ref, watchEffect } = globalThis.Vue;

export default {
    props: {
        post: Object,
        reset: String
    },
    emits: {
        playerUsed: Boolean
    },
    setup(props, { emit }) {
        const playingAudio = ref(false);
        const isPaused = ref(false);

        const readText = text => {
            speak(text, isPaused.value);
            emit("playerUsed", props.post.id);

            playingAudio.value = true;

        };
        const pauseReading = () => {
            pause();

            playingAudio.value = false;
            isPaused.value = true;
        };

        watchEffect(() => {
            if (props.reset !== props.post.id) {
                playingAudio.value = false;
            }
        });

        return {
            playingAudio,
            truncateText,
            readText,
            pauseReading,
            stop
        };
    },
    template: `
        <div class="post-wrapper">            
            <article class="post" >
                <a rel="permalink" v-bind:href="post.url" target="_blank" class="post-link">
                    <span class="visibility-hidden">Read full post "{{ post.title }}"</span>
                </a>
                <header class="post-title-wrapper">
                    <h2 class="post-title">{{ truncateText(post.title.toLowerCase(), 52) }}</h2>
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 48 48" 
                        fill="none"
                        width="48" 
                        height="48"
                        class="post-nav-button" 
                    >
                        <rect x="0.5" y="0.5" width="47" height="47" rx="23.5" stroke="#373737"></rect>
                        <path d="M21.7148 30.8574L28.572 24.0003L21.7148 17.1431" stroke="#373737" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                </header>
                
                <h3 class="post-author post-meta">By {{ post.author_fullname }}</h3>
                <p class="post-content">{{ truncateText(post.selftext) }}</p>
                <p class="post-comment-count post-meta">{{ post.num_comments }} comments</p>
            </article>
            <menu class="post-audio-player">
                <li>
                    <button 
                        type="button" 
                        class="post-audio-button"
                        v-bind:class="{ 'player-in-use': playingAudio }"
                        @click="readText(post.selftext)"
                        v-bind:disabled="!post.selftext"
                    >
                        <span class="visibility-hidden">Listen to {{ post.title }}</span>
                        <svg class="audio-outline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="6 4 20 12 6 20" />
                        </svg>
                    </button>
                </li>
                <li>
                    <button
                        type="button" 
                        class="post-audio-button"
                        @click="pauseReading()"
                        v-bind:disabled="!post.selftext"
                    >
                        <span class="visibility-hidden">Pause audio</span>
                        <svg class="audio-outline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="6" y="4" width="4" height="16" />
                            <rect x="14" y="4" width="4" height="16" />
                        </svg>
                    </button>
                </li>
            </menu>
        </div>
    `
};