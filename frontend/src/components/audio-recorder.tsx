import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, StopCircle } from "lucide-react";
import { cn } from "@/lib/utils"; // Utility for conditional Tailwind classes
import { useTheme } from "next-themes";

const AudioRecorder: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [waveData, setWaveData] = useState<number[]>([]);
  const [timer, setTimer] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const animationRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [recording]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      audioChunksRef.current = [];
    };

    mediaRecorderRef.current.start();
    setRecording(true);
    setTimer(0);
    startWaveformVisualizer(stream);
    startLiveTranscription();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
    stopWaveformVisualizer();
    stopLiveTranscription();
  };

  const startLiveTranscription = () => {
    if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      setTranscript("Speech Recognition API not supported in your browser.");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const liveTranscript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ");
      setTranscript(liveTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setTranscript(`Error in speech recognition: ${event.error}`);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopLiveTranscription = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    recognitionRef.current = null;
  };

  const startWaveformVisualizer = (stream: MediaStream) => {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const render = () => {
      analyser.getByteTimeDomainData(dataArray);
      const normalizedData = Array.from(dataArray).map((value) =>
        value / 128 - 1
      ); // Normalize between -1 and 1
      setWaveData(normalizedData);
      animationRef.current = requestAnimationFrame(render);
    };

    render();
  };

  const stopWaveformVisualizer = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = null;
    setWaveData([]);
  };

  const handleTranscriptEdit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTranscript(e.target.value);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      className={cn(
        "p-6 space-y-6 rounded-md shadow-lg",
        "bg-white dark:bg-neutral-900",
        "max-w-lg mx-auto mt-10"
      )}
    >
      <div className="flex justify-center items-center">
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={recording ? stopRecording : startRecording}
          className={cn(
            "flex items-center justify-center p-4 rounded-full",
            recording ? "bg-red-500 text-white" : "bg-blue-500 text-white",
            "focus:outline-none"
          )}
        >
          {recording ? <StopCircle size={24} /> : <Mic size={24} />}
        </motion.button>
      </div>

      {/* Timer */}
      <div className="text-center text-lg font-bold">
        {formatTime(timer)}
      </div>

      {/* Sound Wave Visualizer */}
      <div className="flex items-center justify-center">
        <div className="w-full h-20 flex space-x-1">
          {waveData.map((value, index) => (
            <motion.div
              key={index}
              className="w-1 bg-blue-500 dark:bg-blue-300"
              animate={{ scaleY: Math.abs(value) * 5 }}
              transition={{
                duration: 0.1,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
          ))}
        </div>
      </div>

      {audioURL && (
        <div>
          <h3 className="font-bold text-lg">Recorded Audio:</h3>
          <audio src={audioURL} controls className="mt-2 w-full" />
        </div>
      )}

      <div>
        <h3 className="font-bold text-lg">Transcript (Editable):</h3>
        <textarea
          value={transcript}
          onChange={handleTranscriptEdit}
          className={cn(
            "w-full mt-2 p-2 rounded-md border",
            "border-gray-300 dark:border-gray-700",
            "bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-200"
          )}
          rows={5}
        />
      </div>
    </div>
  );
};

export default AudioRecorder;



// import React, { useState, useRef, useEffect } from 'react';
// import { Play, Square, Rewind, Star, ChevronLeft, Volume2, Bookmark } from 'lucide-react';

// interface AudioData {
//   url: string;
//   duration: number;
//   transcript: string;
// }

// function App() {
//   const [isRecording, setIsRecording] = useState(false);
//   const [audioData, setAudioData] = useState<AudioData | null>(null);
//   const [currentTime, setCurrentTime] = useState('00:00.00');
//   const [waveformData, setWaveformData] = useState<number[]>([]);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const audioChunksRef = useRef<Blob[]>([]);
//   const recognitionRef = useRef<SpeechRecognition | null>(null);

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       // @ts-ignore
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//       if (SpeechRecognition) {
//         recognitionRef.current = new SpeechRecognition();
//         recognitionRef.current.continuous = true;
//         recognitionRef.current.interimResults = true;
//       }
//     }
//   }, []);

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       mediaRecorderRef.current = new MediaRecorder(stream);
//       audioChunksRef.current = [];

//       mediaRecorderRef.current.ondataavailable = (event) => {
//         audioChunksRef.current.push(event.data);
//       };

//       mediaRecorderRef.current.onstop = () => {
//         const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
//         const audioUrl = URL.createObjectURL(audioBlob);
//         setAudioData({
//           url: audioUrl,
//           duration: audioChunksRef.current.length / 10,
//           transcript: '',
//         });