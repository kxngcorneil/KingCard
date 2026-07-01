import { Random, nativeMath } from "random-js";
import { franc } from "franc-min";

export interface Flashcard {
  term: string;
  definition: string;
}

export type modeType = "free" | "elimination" | "reverse";

const random = new Random(nativeMath);

// 🟢 Fixed return type to Flashcard[]
export const processUploadedDeck = (parsedRows: any[][], isRandomized: boolean): Flashcard[] => {
  const parsedCards: Flashcard[] = parsedRows.map((row: any) => ({
    term: row[0]?.trim() || "",
    definition: row[1]?.trim() || "",
  }));

  return isRandomized ? random.shuffle([...parsedCards]) : parsedCards;
};

interface VerificationInput {
  currentInput: string;
  currentIndex: number;
  sessionMode: modeType; // Fixed typo (sesionMode -> sessionMode)
  deck: Flashcard[];
  activePool: Flashcard[];
}

// 🟢 Added explicit interface for the return type structure
interface VerificationResult {
  isCorrect: boolean;
  nextIndex: number;
  updatedPool?: Flashcard[];
  isFinished?: boolean;
}

export const calculateAdvanceState = ({
  currentInput,
  currentIndex,
  sessionMode,
  deck,
  activePool,
}: VerificationInput): VerificationResult => {
  const currentCardList = sessionMode === "elimination" ? activePool : deck;
  const currentCard = currentCardList[currentIndex];

  if (!currentCard) return { isCorrect: false, nextIndex: currentIndex };

  const targetAnswer = sessionMode === "reverse" ? currentCard.term : currentCard.definition;

  // Check if answer is correct (case-insensitive and trimmed)
  if (currentInput.toLowerCase().trim() === targetAnswer.toLowerCase()) {
    if (sessionMode === "elimination") {
      const updatedPool = activePool.filter((_, idx) => idx !== currentIndex);
      const isFinished = updatedPool.length === 0;
      const nextIndex = currentIndex >= updatedPool.length ? 0 : currentIndex;

      return { isCorrect: true, nextIndex, updatedPool, isFinished };
    } else {
      const nextIndex = currentIndex < deck.length - 1 ? currentIndex + 1 : 0;
      return { isCorrect: true, nextIndex };
    }
  }

  // Fallback if answer is incorrect
  return { isCorrect: false, nextIndex: currentIndex };
};

//detects language in deck
// detects language in deck modularly
// Read the term, guess the language code, use basic native browser TTS
// Read the term, guess the language code, use basic native browser TTS
export const speakDetectedText = (text: string) => {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  // 1. Instantly clear out any stuck audio channels
  window.speechSynthesis.cancel();

  // 2. Pass text straight to franc-min to detect language code
  let threeLetterCode = franc(text);

  // 3. 🟢 FALLBACK FOR SHORT STRINGS: If franc fails ('und'), inspect characters directly
  if (threeLetterCode === "und") {
    // Check for Japanese characters (Hiragana, Katakana, Kanji)
    if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text)) {
      threeLetterCode = "jpn";
    } 
    // Check for Korean Hangul
    else if (/[\uAC00-\uD7A3]/.test(text)) {
      threeLetterCode = "kor";
    } 
    // Default fallback to English if it's standard alphanumeric text
    else if (/^[a-zA-Z0-9\s.,!?-]+$/.test(text)) {
      threeLetterCode = "eng";
    } else {
      return; // Truly unidentifiable
    }
  }

  // 4. Map the 3-letter code directly to its 2-letter fallback string target
  const isoMapping: Record<string, string> = {
    jpn: "ja",
    eng: "en",
    fra: "fr",
    spa: "es",
    deu: "de",
    kor: "ko",
    cmn: "zh",
  };
  const targetLang = isoMapping[threeLetterCode] || threeLetterCode.substring(0, 2);

  // 5. Create basic utterance and hand it directly to the OS to read natively
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = targetLang; 

  window.speechSynthesis.speak(utterance);
};