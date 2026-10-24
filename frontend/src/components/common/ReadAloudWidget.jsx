import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  ChevronUp,
  ChevronDown,
  Sparkles,
  AlertCircle,
} from "lucide-react";

/**
 * Extracts visible, meaningful text from the page content.
 * Avoids navigation menus, buttons, decorative text, and private form fields.
 */
function extractPageText() {
  // If user has selected custom text, prioritize it
  if (typeof window !== "undefined") {
    const selection = window.getSelection()?.toString()?.trim();
    if (selection && selection.length > 5) {
      return selection;
    }
  }

  const main =
    document.querySelector("main") ||
    document.querySelector("article") ||
    document.body;

  if (!main) return "";

  // Clone to safely remove noise without touching the DOM
  const clone = main.cloneNode(true);

  // Remove navigation, buttons, footers, forms, scripts, svgs, and accessibility controls
  const ignoredSelectors = [
    "nav",
    "header",
    "footer",
    "button",
    "input",
    "textarea",
    "select",
    "svg",
    "script",
    "style",
    "[aria-hidden='true']",
    "[role='dialog']",
    ".read-aloud-widget",
  ];

  ignoredSelectors.forEach((selector) => {
    clone.querySelectorAll(selector).forEach((el) => el.remove());
  });

  // Extract meaningful text blocks: headings and paragraphs
  const textNodes = [];
  const textElements = clone.querySelectorAll("h1, h2, h3, h4, p, li");

  textElements.forEach((el) => {
    const text = el.textContent?.trim();
    // Exclude short button labels or symbol-only snippets
    if (text && text.length > 3 && !text.startsWith("©")) {
      textNodes.push(text);
    }
  });

  const fullText = textNodes.join(". ");
  // Truncate to reasonable safe ceiling if excessively long
  return fullText.slice(0, 4000);
}

export default function ReadAloudWidget() {
  const location = useLocation();

  const [isSupported, setIsSupported] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const utteranceRef = useRef(null);

  // Check Web Speech API support
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsSupported(false);
    }
  }, []);

  // Stop speech when navigating between routes
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setStatusMessage("");
    }
  }, [location.pathname]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopSpeech = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setStatusMessage("");
    }
  }, []);

  const pauseSpeech = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        setIsPaused(true);
        setStatusMessage("Paused");
      }
    }
  }, []);

  const resumeSpeech = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
        setStatusMessage("Reading...");
      }
    }
  }, []);

  const playSpeech = useCallback(() => {
    if (!isSupported) {
      setStatusMessage("Speech synthesis is not supported on this browser.");
      return;
    }

    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    // If currently paused, resume
    if (isPaused) {
      resumeSpeech();
      return;
    }

    // Cancel any previous speech instance
    window.speechSynthesis.cancel();

    const textToRead = extractPageText();
    if (!textToRead) {
      setStatusMessage("No readable text found on this page.");
      setTimeout(() => setStatusMessage(""), 3000);
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Select natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice =
        voices.find((v) => v.lang.startsWith("en") && !v.name.includes("whisper")) ||
        voices.find((v) => v.lang.startsWith("en")) ||
        voices[0];

      if (naturalVoice) {
        utterance.voice = naturalVoice;
      }

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
        setStatusMessage("Reading page content...");
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setStatusMessage("");
      };

      utterance.onerror = (e) => {
        // Interrupted is normal when user cancels or navigates
        if (e.error !== "interrupted" && e.error !== "canceled") {
          console.warn("Speech synthesis error:", e);
          setStatusMessage("Speech was interrupted.");
        }
        setIsPlaying(false);
        setIsPaused(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsExpanded(true);
    } catch {
      setStatusMessage("Unable to start speech on this device.");
      setIsPlaying(false);
    }
  }, [isSupported, isPaused, resumeSpeech]);

  if (!isSupported) {
    return null; // Gracefully hide widget if browser lacks Web Speech API
  }

  return (
    <aside
      aria-label="Website Read Aloud Accessibility Control"
      className="fixed bottom-6 right-6 z-40 read-aloud-widget"
    >
      {/* Minimized Floating Button */}
      {!isExpanded ? (
        <button
          type="button"
          onClick={() => {
            setIsExpanded(true);
            if (!isPlaying) playSpeech();
          }}
          aria-label={isPlaying ? "Read Aloud options" : "Listen to page content (Read Aloud)"}
          className={`flex items-center gap-2 px-4 py-3 rounded-full font-semibold text-xs shadow-xl transition-all duration-300 backdrop-blur-md border ${
            isPlaying
              ? "bg-teal-600 text-white border-teal-500 shadow-teal-700/30 animate-pulse-subtle"
              : "bg-white/95 dark:bg-gray-900/95 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-800 hover:border-teal-500 dark:hover:border-teal-400"
          }`}
        >
          {isPlaying ? (
            <>
              {/* Soundwave equalizer indicator */}
              <div className="flex items-center gap-0.5 h-4 px-1" aria-hidden="true">
                <span className="w-1 bg-white rounded-full animate-[soundwave_0.8s_ease-in-out_infinite]" />
                <span className="w-1 bg-white rounded-full animate-[soundwave_1.1s_ease-in-out_infinite_0.2s]" />
                <span className="w-1 bg-white rounded-full animate-[soundwave_0.7s_ease-in-out_infinite_0.4s]" />
              </div>
              <span>Listening...</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Read Aloud</span>
            </>
          )}
        </button>
      ) : (
        /* Expanded Accessible Control Panel */
        <div className="bg-white/95 dark:bg-gray-900/95 text-gray-900 dark:text-gray-100 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl p-4 w-72 backdrop-blur-md animate-slide-up">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400">
                <Volume2 className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                  Read Aloud
                </h4>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">
                  Web Speech Assist
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              aria-label="Minimize Read Aloud widget"
              className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Status line */}
          <div className="py-2.5 text-xs text-center min-h-[34px] flex items-center justify-center text-gray-600 dark:text-gray-300">
            {isPlaying && !isPaused ? (
              <div className="flex items-center gap-1.5 text-teal-700 dark:text-teal-400 font-medium">
                <div className="flex items-center gap-0.5 h-3" aria-hidden="true">
                  <span className="w-0.5 bg-teal-600 dark:bg-teal-400 rounded-full animate-[soundwave_0.8s_ease-in-out_infinite]" />
                  <span className="w-0.5 bg-teal-600 dark:bg-teal-400 rounded-full animate-[soundwave_1.1s_ease-in-out_infinite_0.2s]" />
                  <span className="w-0.5 bg-teal-600 dark:bg-teal-400 rounded-full animate-[soundwave_0.7s_ease-in-out_infinite_0.4s]" />
                </div>
                <span>Reading page content</span>
              </div>
            ) : isPaused ? (
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                Playback paused
              </span>
            ) : statusMessage ? (
              <span className="text-gray-500 dark:text-gray-400">{statusMessage}</span>
            ) : (
              <span className="text-gray-400 text-[11px]">
                Click play or highlight text on page
              </span>
            )}
          </div>

          {/* Playback Controls */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {/* Play / Resume */}
            {!isPlaying || isPaused ? (
              <button
                type="button"
                onClick={playSpeech}
                aria-label={isPaused ? "Resume speech" : "Start reading page"}
                className="col-span-2 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-sm transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isPaused ? "Resume" : "Play"}</span>
              </button>
            ) : (
              /* Pause */
              <button
                type="button"
                onClick={pauseSpeech}
                aria-label="Pause speech"
                className="col-span-2 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-sm transition-all"
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </button>
            )}

            {/* Stop */}
            <button
              type="button"
              onClick={stopSpeech}
              disabled={!isPlaying && !isPaused}
              aria-label="Stop reading"
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Square className="w-3.5 h-3.5" />
              <span>Stop</span>
            </button>
          </div>

          <div className="mt-2 text-[10px] text-gray-400 dark:text-gray-500 text-center">
            Tip: Highlight any paragraph to read just that text.
          </div>
        </div>
      )}
    </aside>
  );
}
