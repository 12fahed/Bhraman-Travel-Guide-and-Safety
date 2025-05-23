"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Mic, MicOff } from "lucide-react";
import { toast } from "sonner"; // Import Sonner
import ParticleSwarmLoader from "@/components/particle-swarm-loader";

const CONSENT_PARAGRAPH =
  "This is a consent paragraph that needs to be read aloud. Once you have read through the entire paragraph, you will be able to continue.";

export default function ConsentUI() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [words, setWords] = useState(
    CONSENT_PARAGRAPH.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(" ")
  );
  const [spokenWords, setSpokenWords] = useState<string[]>([]);
  const [consentGiven, setConsentGiven] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      (typeof window !== "undefined" && "SpeechRecognition" in window) ||
      "webkitSpeechRecognition" in window
    ) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let currentTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        checkSpokenWords(currentTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      console.error("Speech recognition not supported");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    const alreadyConsented = localStorage.getItem("consent") === "true";
    if (alreadyConsented) {
      toast.success("You have already consented.");
      navigate("/dashboard/ai/fam"); // Redirect immediately
    }
  }, [navigate]);

  const checkSpokenWords = (currentTranscript: string) => {
    const transcriptWords = currentTranscript.toLowerCase().split(/\s+/);
    const newSpokenWords = [...spokenWords];

    for (let i = newSpokenWords.length; i < words.length; i++) {
      const wordRegex = new RegExp(`\\b${words[i].toLowerCase()}\\b`, "i");
      if (transcriptWords.some((word) => wordRegex.test(word))) {
        newSpokenWords.push(words[i]);
      } else {
        break;
      }
    }

    setSpokenWords(newSpokenWords);

    if (newSpokenWords.length === words.length) {
      setConsentGiven(true);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleConsentSubmit = () => {
    setIsLoading(true); // Start loading
    setTimeout(() => {
      toast.success("Voice cloned successfully!"); // Show notification
      localStorage.setItem("consent", "true");
      navigate("/dashboard/ai/fam"); // Redirect
    }, 7000); // Wait for 5 seconds
  };

  return (
    <div className="">
      <CardHeader>
        <CardTitle className="text-primary text-2xl font-semibold">
          Consent Paragraph Reader
        </CardTitle>
      </CardHeader>
      {isLoading?<ParticleSwarmLoader />:
      <CardContent>
        <div className="space-y-6">
          <Button
            onClick={toggleListening}
            variant={isListening ? "destructive" : "default"}
            className="transition-transform transform hover:scale-105 w-full"
          >
            {isListening ? (
              <>
                Stop <MicOff />
              </>
            ) : (
              <>
                Start <Mic />
              </>
            )}
          </Button>

          <div
            className="p-4 bg-muted rounded-md border border-dashed border-primary"
            style={{ wordWrap: "break-word", overflowWrap: "break-word", overflow: "hidden" }}
          >
            {words.map((word, index) => (
              <span
                key={index}
                className={`mr-1 font-medium transition-all duration-200 ${
                  index < spokenWords.length
                    ? "text-muted-foreground line-through"
                    : "text-primary"
                }`}
              >
                {word}
              </span>
            ))}
          </div>

          <div className="p-4 bg-muted rounded-md min-h-[100px] max-h-[300px] overflow-y-auto">
            <p className="whitespace-pre-wrap text-secondary-foreground">
              {transcript}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Checkbox
              id="consent"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              disabled={!consentGiven}
              className="transition-all focus:ring-primary"
            />
            <label
              htmlFor="consent"
              className="text-primary cursor-pointer select-none"
            >
              I have read and agree to the terms and conditions
            </label>
          </div>

          <Button
            onClick={handleConsentSubmit}
            variant="default"
            className="w-full mt-4"
            disabled={!consentGiven || isLoading}
          >
            "Submit"
          </Button>
        </div>
      </CardContent>}
    </div>
  );
}
