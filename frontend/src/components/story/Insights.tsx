import { AlertTriangle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const fallbackInsights = [
  "A moment frozen in time, meaningful and unique.",
  "Memories that whisper stories of the past.",
  "Each image carries a world of emotions.",
  "A snapshot capturing life's beautiful complexity.",
  "Fragments of joy, preserved forever.",
  "Silent witnesses to personal journeys.",
  "Moments that transcend time and space.",
  "Echoes of experiences that shape our narrative.",
];

const generateGeminiInsight = async (media: any) => {
  try {
    // Use first media item
    const mediaItem = media[0];

    const response = await fetch(mediaItem.url);
    const blob = await response.blob();
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result.split(",")[1]);
        } else {
          reject(new Error("Failed to read file"));
        }
      };

      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    const geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": "AIzaSyCaMUsyaIG6IK_AmVWLj6CEyNTUgpQQWR4",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: "image/jpeg",
                    data: base64,
                  },
                },
                {
                  text: `Generate a heartwarming, brief insight about this memory.`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!geminiResponse.ok) {
      throw new Error("API request failed");
    }

    const data = await geminiResponse.json();
    return (
      data.candidates[0].content.parts[0].text ||
      fallbackInsights[Math.floor(Math.random() * fallbackInsights.length)]
    );
  } catch (error) {
    console.error("Insight generation error:", error);
    return fallbackInsights[
      Math.floor(Math.random() * fallbackInsights.length)
    ];
  }
};

export const CapsuleInsights = ({ media }: { media: any[] }) => {
  const [insight, setInsight] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInsight = async () => {
      if (!media || media.length === 0) return;

      setIsLoading(true);
      try {
        const generatedInsight = await generateGeminiInsight(media);
        setInsight(generatedInsight);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsight();
  }, [media]);

  if (!media || media.length === 0) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <AlertTriangle className="h-4 w-4" />
        <span>No media to generate insights</span>
      </div>
    );
  }

  return (
    <div className="bg-muted p-4 rounded-lg flex items-center gap-3">
      <Sparkles
        className={`h-6 w-6 ${
          isLoading ? "animate-pulse text-gray-500" : "text-primary"
        }`}
      />
      <p className="text-sm">{isLoading ? "Generating insight..." : insight}</p>
    </div>
  );
};

export default CapsuleInsights;
