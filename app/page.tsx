"use client";

import {
  Container,
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Button,
  TextField,
  Box,
  Divider,
  Tooltip,
} from "@mui/material";

import InputFileUpload from "./components/buttons/InputFileUpload";
import Papa from "papaparse";
import { ExpandMore as ExpandMoreIcon, ArrowBack as ArrowBackIcon, VolumeUp } from "@mui/icons-material";
import { useState } from "react";
import { speakDetectedText } from "./utils/flashcardEngine";
import { VolumeUp as VolumeUpIcon } from "@mui/icons-material";

// 🟢 NEW: Unified engine imports from your utility helper file
import { processUploadedDeck, calculateAdvanceState, Flashcard, modeType } from "./utils/flashcardEngine";

export default function Home() {
  const [isRandomized, setIsRandomized] = useState<boolean>(false);
  const [topExpanded, setTopExpanded] = useState<boolean>(true);
  const [isAutocomplete, setIsAutocomplete] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [activePool, setActivePool] = useState<Flashcard[]>([]); 

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>("");
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [sessionMode, setSessionMode] = useState<modeType>("free");

  const handleDeckUpload = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        // 🟢 NEW PART: Using the utility engine to clean up data structure variations instantly
        const finalCards = processUploadedDeck(results.data as any[][], isRandomized);
        setDeck(finalCards);
        setActivePool([...finalCards]);
        setCurrentIndex(0);
        setUserInput("");
        setIsFinished(false);
      },
      error(error) {
        console.error("Error importing deck", error.message);
      },
    });
  };

  // 🟢 NEW PART: Integrated verification wrapper routing calculations to the engine 
  const runVerificationPipeline = (inputToVerify: string): boolean => {
    const result = calculateAdvanceState({
      currentInput: inputToVerify,
      currentIndex,
      sessionMode,
      deck,
      activePool,
    });

    // If answer is valid, update local visual react tree states seamlessly
    if (result.isCorrect) {
      setUserInput("");
      setIsError(false);
      setCurrentIndex(result.nextIndex);

      if (result.updatedPool) {
        setActivePool(result.updatedPool);
      }
      if (result.isFinished !== undefined) {
        setIsFinished(result.isFinished);
      }
      return true;
    }
    return false;
  };

  const handleCheckAnswer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 🟢 NEW PART: Uses centralized verification routing pipeline instead of a local loop
    const isCorrect = runVerificationPipeline(userInput);
    if (!isCorrect) setIsError(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserInput(val);
    setIsError(false);

    if (isAutocomplete) {
      // 🟢 NEW PART: Uses centralized verification routing pipeline for auto-advance evaluation
      const isCorrect = runVerificationPipeline(val);
      if (!isCorrect) {
        const currentCardList = sessionMode === "elimination" ? activePool : deck;
        const currentCard = currentCardList[currentIndex];
        const targetAnswer = sessionMode === "reverse" ? currentCard?.term : currentCard?.definition;
        
        if (targetAnswer && val.length >= targetAnswer.length) {
          setIsError(true);
        }
      }
    }
  };

  const handleClearDeck = () => {
    setDeck([]);
    setCurrentIndex(0);
    setActivePool([]);
    setUserInput("");
    setIsFinished(false);
    setIsError(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Stack spacing={1}>
        {/* Top section: title and intro content */}
        <Accordion
          expanded={topExpanded}
          onChange={(_, expanded) => setTopExpanded(expanded)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">KingCard</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Welcome to <strong>KingCard</strong> a platform designed to streamline
              learning by forcing active recall. Simply import a two-column CSV(or .txt) deck containing
              your terms alongside definitions choose a mode and begin reinforcing your material.
            </Typography>

            <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.6 }}>
              For the application to parse your cards correctly, your CSV or text file must be organized 
              with the <strong>Term</strong> in the first column and the <strong>Definition</strong> in the second column, 
              separated by a comma. Do not include headers. For example:
            </Typography>

            {/* Visual CSV Formatting Box */}
            <Box 
              component="pre" 
              sx={{ 
                mt: 1.5, 
                p: 2, 
                backgroundColor: 'action.hover', 
                borderRadius: 1, 
                fontFamily: 'monospace', 
                fontSize: '0.9rem', 
                textAlign: 'left',
                border: '1px solid',
                borderColor: 'divider',
                color: 'text.secondary'
              }}
            >
              こんにちは,Hello<br />
              ありがとう,Thank you<br />
              おやすみ,Good night
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Middle section: upload area and flashcard session */}
        <Box>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              textAlign: "center",
              position: "relative",
              borderStyle: deck.length === 0 ? "dashed" : "solid",
            }}
          >
            {deck.length === 0 ? (
              /* State A: Show upload options */
              <Stack spacing={2}>
                <Stack spacing={1}>
                  <InputFileUpload
                    label="Upload Deck"
                    accept=".csv,.txt"
                    onFileSelect={(files) => handleDeckUpload(files)}
                  />
                  <Divider />
                </Stack>

                <Box sx={{ width: "100%", maxWidth: 600 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 2,
                      textAlign: "left",
                      fontWeight: "bold",
                      color: "#aaa",
                    }}
                  >
                    Select Mode:
                  </Typography>
                </Box>

                <Stack spacing={2}>
                  <Button
                    fullWidth
                    variant={sessionMode === "free" ? "contained" : "outlined"}
                    onClick={() => setSessionMode("free")}
                    sx={{
                      py: 2,
                      textTransform: "none",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="button"
                      sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
                    >
                      Brute Force / Free Mode
                    </Typography>
                    <Typography variant="caption">
                      Just keeps cycling through the entire deck over and over again
                    </Typography>
                  </Button>

                  <Button
                    fullWidth
                    variant={sessionMode === "elimination" ? "contained" : "outlined"}
                    onClick={() => setSessionMode("elimination")}
                    sx={{
                      py: 2,
                      textTransform: "none",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="button"
                      sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
                    >
                      Elimination Mode
                    </Typography>
                    <Typography variant="caption">
                      Words are removed after you get them right a certain amount of times
                    </Typography>
                  </Button>

                  <Button
                    fullWidth
                    variant={sessionMode === "reverse" ? "contained" : "outlined"}
                    onClick={() => setSessionMode("reverse")}
                    sx={{
                      py: 2,
                      textTransform: "none",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="button"
                      sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
                    >
                      Reverse
                    </Typography>
                    <Typography variant="caption">
                      Reverse the word and answer display target criteria
                    </Typography>
                  </Button>
                  <Divider />
                </Stack>

                <Box sx={{ width: "100%", maxWidth: 600, mt: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      mb: 1,
                      display: 'block',
                      textAlign: "left",
                      fontWeight: "bold",
                      color: "text.secondary",
                    }}
                  >
                    Session Preferences
                  </Typography>
                  <Stack direction="row" spacing={1.5}>
                    <Tooltip describeChild title="Decide if you go down the imported deck in order">
                      <Button
                        fullWidth
                        variant={isRandomized ? "contained" : "outlined"}
                        onClick={() => setIsRandomized(!isRandomized)}
                        color={isRandomized ? "primary" : "inherit"}
                        sx={{
                          py: 1.5,
                          fontWeight: "bold",
                          textTransform: "none",
                          fontSize: '0.85rem'
                        }}
                      >
                        {isRandomized ? "Shuffle Order" : "Strict Order"}
                      </Button>
                    </Tooltip>
                    <Tooltip describeChild title="If enabled automatically go to the next word when answer is right">
                      <Button
                        fullWidth
                        variant={isAutocomplete ? "contained" : "outlined"}
                        onClick={() => setIsAutocomplete(!isAutocomplete)}
                        sx={{
                          py: 1.5,
                          fontWeight: "bold",
                          textTransform: "none",
                          fontSize: '0.85rem'
                        }}
                      >
                        {isAutocomplete ? "Auto Advance: On" : "Auto Advance: Off"}
                      </Button>
                    </Tooltip>
                  </Stack>
                </Box>
              </Stack>
            ) : (
              /* State B: Active Flashcard Session */
              <Box sx={{ pt: 5 }}>
                <Box sx={{ position: "absolute", top: 16, left: 16 }}>
                  <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={handleClearDeck}
                    color="inherit"
                    sx={{
                      textTransform: "none",
                      opacity: 0.7,
                      "&:hover": { opacity: 1 },
                    }}
                  >
                    Change Deck
                  </Button>
                </Box>

                {isFinished ? (
                  <Stack spacing={2} sx={{ alignItems: "center" }}>
                    <Typography variant="h6">Session Done</Typography>
                    <Button variant="outlined" onClick={handleClearDeck}>
                      Start Over
                    </Button>
                  </Stack>
                ) : (
                  <Stack
                    spacing={4}
                    component="form"
                    onSubmit={handleCheckAnswer}
                  >
                    <Typography
                      variant="h3"
                      align="center"
                      sx={{ fontWeight: "bold", mt: 2 }}
                    >
                      {sessionMode === "reverse"
                        ? deck[currentIndex]?.definition
                        : sessionMode === 'elimination'
                        ? activePool[currentIndex]?.term
                        : deck[currentIndex]?.term}
                    </Typography>

                    <Button size="small"
                    onClick={() =>{
                      const currentCardList = sessionMode === "elimination" ? activePool : deck;
                      const activeCard = currentCardList[currentIndex];
                      if(activeCard){
                        const phraseToSpeak = sessionMode === "reverse" ? activeCard.definition : activeCard.term;
                        speakDetectedText(phraseToSpeak);
                      }
                    }}
                    sx={{mt: 2, minWidth: 'auto', p:1}}
                    aria-label="play-case-audio"
                    >
                      <VolumeUpIcon color="primary" />
                    </Button>

                    <TextField
                      fullWidth
                      autoFocus
                      error={isError}
                      placeholder="Type translation"
                      value={userInput}
                      onChange={handleInputChange}
                      variant="outlined"
                      slotProps={{
                        htmlInput: {
                          style: { textAlign: "center", backgroundColor: isError ? 'rgba(211, 47, 47, 0.08)' : undefined},
                          "aria-label": "answer-input",
                        },
                      }}
                    />

                    <Typography variant="caption" align="center" sx={{color: '#aaa'}}>
                      {sessionMode === 'elimination'
                        ? `Cards Remaining: ${activePool.length}`
                        : `Card ${currentIndex + 1} of ${deck.length} (${sessionMode.toUpperCase()} MODE)`
                      }
                    </Typography>
                  </Stack>
                )}
              </Box>
            )}
          </Paper>
        </Box>

        {/* About Information Section */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">About</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={1}>
              <Typography variant="body1" sx={{ mb: 1, lineHeight: 1.6 }}>
                <strong>KingCard</strong> leverages systematic active recall mechanics to optimize memory retention.
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                • <strong>Brute Force / Free Mode:</strong> An infinite iteration cycle through your entire loaded card index, excellent for initial exposure and casual review.
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                • <strong>Elimination Mode:</strong> Tracks correct answers and filters successfully entered terms out of the pool until the session is cleared.
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                • <strong>Reverse Mode:</strong> Flips the structural prompt rules completely, presenting definitions first.
              </Typography>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Stack>
    </Container>
  );
}