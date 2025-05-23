import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check } from 'lucide-react'
import { useNavigate } from "react-router-dom";
const languagePreferences = [
    "English",
    "Español (español)",
    "Français (français)",
    "Deutsch (deutsch)",
    "中文 (Mandarin Chinese)",
    "हिन्दी (Hindi)",
    "বাংলা (Bengali)",
    "Português (português)",
    "Русский (Russian)",
    "日本語 (Japanese)",
    "한국어 (Korean)",
    "Italiano (Italian)",
    "العربية (Arabic)",
    "Türkçe (Turkish)",
    "Nederlands (Dutch)",
    "Svenska (Swedish)",
    "Ελληνικά (Greek)",
    "Polski (Polish)",
    "עברית (Hebrew)",
    "ภาษาไทย (Thai)",
    "Tiếng Việt (Vietnamese)",
    "اردو (Urdu)",
    "Bahasa Melayu (Malay)",
    "Filipino (Tagalog)",
    "廣東話 (Cantonese)",
    "தமிழ் (Tamil)",
    "తెలుగు (Telugu)",
    "मराठी (Marathi)",
    "ਪੰਜਾਬੀ (Punjabi)",
    "ગુજરાતી (Gujarati)",
    "മലയാളം (Malayalam)",
    "ಕನ್ನಡ (Kannada)",
    "Afrikaans",
    "Magyar (Hungarian)",
    "Română (Romanian)",
    "Čeština (Czech)",
    "Slovenčina (Slovak)",
    "Українська (Ukrainian)",
    "Српски (Serbian)",
    "Hrvatski (Croatian)",
    "Български (Bulgarian)",
    "Suomi (Finnish)",
    "Dansk (Danish)",
    "Norsk (Norwegian)",
    "Íslenska (Icelandic)",
    "Монгол (Mongolian)",
    "Kiswahili (Swahili)",
    "Hausa",
    "Yorùbá",
    "isiZulu (Zulu)",
    "پښتو (Pashto)",
    "فارسی (Farsi)",
    "Kurdî (Kurdish)",
    "ဗမာစာ (Burmese)",
    "ລາວ (Lao)",
    "ខ្មែរ (Khmer)",
    "සිංහල (Sinhala)",
    "नेपाली (Nepali)",
    "བོད་སྐད་ (Tibetan)",
    "Māori",
    "Gagana Samoa (Samoan)",
    "ʻŌlelo Hawaiʻi (Hawaiian)",
    "Euskara (Basque)",
    "Català (Catalan)",
    "Galego (Galician)",
    "Cymraeg (Welsh)",
    "Gàidhlig (Scottish Gaelic)",
    "Gaeilge (Irish)",
    "Gaelg (Manx)",
    "Brezhoneg (Breton)",
    "Lëtzebuergesch (Luxembourgish)",
    "Malti (Maltese)",
    "Corsu (Corsican)",
    "Aymar aru (Aymara)",
    "Runa Simi (Quechua)",
    "Nāhuatl (Nahuatl)",
    "Avañe'ẽ (Guarani)",
    "ᐃᓄᒃᑎᑐᑦ (Inuktitut)",
    "ᐊᓂᔑᓈᐯᒧᐎᓐ (Ojibwe)",
    "ᏣᎳᎩ (Cherokee)",
    "Kreyòl Ayisyen (Haitian Creole)",
    "ꦧꦱꦗꦮ (Javanese)",
    "ᮘᮜ᮪ᮘᮞ (Sundanese)",
    "ᬩᬮᬶ (Balinese)",
    "Faka-Tonga (Tongan)",
    "Chamoru (Chamorro)",
    "Vosa Vakaviti (Fijian)",
    "Bislama",
    "Tok Pisin",
    "A tekoi er a Belau (Palauan)",
    "Kajin M̧ajeļ (Marshallese)",
    "རྫོང་ཁ (Dzongkha)",
    "Wolof",
    "አማርኛ (Amharic)",
    "ትግርኛ (Tigrinya)",
    "Soomaali (Somali)",
    "ChiShona (Shona)",
    "isiXhosa (Xhosa)",
    "Setswana (Tswana)",
    "Sesotho",
    "Malagasy",
    "Lingála",
    "Ikinyarwanda (Kinyarwanda)",
  ];  
  

const transitionProps = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 0.5,
}

export default function TravelPreferenceSelector() {
  const [selected, setSelected] = useState<string[]>([])
  const navigate = useNavigate()
  const togglePreference = (preference: string) => {
    setSelected((prev) =>
      prev.includes(preference) ? prev.filter((p) => p !== preference) : [...prev, preference]
    )
  }

  const handleSubmit = () => {
    console.log("Selected Travel Preferences:", selected)
    localStorage.setItem("languagePreferences", JSON.stringify(selected))
    navigate("/placesvisited")
  }

  return (
    <div className="min-h-screen bg-white p-6 pt-40">
      <h1 className="text-zinc-800 text-3xl font-semibold mb-12 text-center">
        What are your language preferences?
      </h1>
      <div className="max-w-[570px] mx-auto">
        <motion.div 
          className="flex flex-wrap gap-3 overflow-visible"
          layout
          transition={transitionProps}
        >
          {languagePreferences.map((preference) => {
            const isSelected = selected.includes(preference)
            return (
              <motion.button
                key={preference}
                onClick={() => togglePreference(preference)}
                layout
                initial={false}
                animate={{
                    backgroundColor: isSelected ? "#fce7f3" : "#fdf2f8",
                  }}
                  whileHover={{
                    backgroundColor: isSelected ? "#f9a8d4" : "#fce7f3",
                  }}
                  whileTap={{
                    backgroundColor: isSelected ? "#f472b6" : "#f9a8d4",
                  }}
                  
                transition={{ ...transitionProps, backgroundColor: { duration: 0.1 } }}
                className={
                  `inline-flex items-center px-4 py-2 rounded-full text-base font-medium
                  whitespace-nowrap overflow-hidden ring-1 ring-inset
                  ${isSelected 
                    ? "text-pink-700 ring-pink-300" 
                    : "text-zinc-600 ring-zinc-300"}`
                }
              >
                <motion.div 
                  className="relative flex items-center"
                  animate={{ 
                    width: isSelected ? "auto" : "100%",
                    paddingRight: isSelected ? "1.5rem" : "0",
                  }}
                  transition={{ ease: [0.175, 0.885, 0.32, 1.275], duration: 0.3 }}
                >
                  <span>{preference}</span>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={transitionProps}
                        className="absolute right-0"
                      >
                        <div className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" strokeWidth={1.5} />
                        </div>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.button>
            )
          })}
        </motion.div>
      </div>
      <button 
        onClick={handleSubmit}
        disabled={selected.length === 0}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2  bg-pink-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-pink-600 transition disabled:bg-pink-300 disabled:cursor-not-allowed"
      >
        Submit
      </button>
    </div>
  )
}
