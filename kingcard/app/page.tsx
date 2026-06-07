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
  AccordionActions,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InputFileUpload from "./components/buttons/InputFileUpload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Papa from "papaparse";
import { useState } from "react";
import { Random, nativeMath } from "random-js";

interface Flashcard {
  term: string;
  definition: string;
}

type modeType = "free" | "elimination" | "reverse";

export default function Home() {
  const random = new Random(nativeMath);
  const [isRandomized, setIsRandomized] = useState<boolean>(false);
  const [topExpanded, setTopExpanded] = useState<boolean>(true);
  const [aboutExpanded, setAboutExpanded] = useState<boolean>(true);

  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [activePool, setActivePool] = useState<Flashcard[]>([]); //for elimination

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  const [sessionMode, setSessionMode] = useState<modeType>("free");

  const handleDeckUpload = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    console.log("Processing deck...", file.name);

    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedCards: Flashcard[] = results.data.map((row: any) => ({
          term: row[0]?.trim() || "",
          definition: row[1]?.trim() || "",
        }));

        const finalCards = isRandomized
          ? random.shuffle([...parsedCards])
          : parsedCards;

        setDeck(finalCards);
        setActivePool([...finalCards]);
        setCurrentIndex(0);
        setUserInput("");
        setIsFinished(false);
        console.log(parsedCards);
      },
      error(error) {
        console.error("Error importing deck", error.message);
      },
    });
  };

  const handleClearDeck = () => {
    setDeck([]);
    setCurrentIndex(0);
    setUserInput("");
    setIsFinished(false);
  };

  const handleCheckAnswer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const currentCardList = sessionMode === "elimination" ? activePool : deck;
    const currentCard = currentCardList[currentIndex];
    if (!currentCard) return;

    const targetAnswer =
      sessionMode === "reverse" ? currentCard.term : currentCard.definition;

    if (userInput.toLowerCase().trim() === targetAnswer.toLowerCase()) {
      setUserInput("");

      //elimination mode answr flo
      if (sessionMode === "elimination") {
        const updatedPool = activePool.filter((_, idx) => idx !== currentIndex);
        setActivePool(updatedPool);

        if (updatedPool.length === 0) {
          setIsFinished(true);
        } else {
          setCurrentIndex(
            currentIndex >= updatedPool.length ? 0 : currentIndex,
          );
        }
      } else if (sessionMode === "reverse") {
        if (currentIndex < deck.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setCurrentIndex(0);
        }
      }

      //Free Mode
      else {
        if (currentIndex < deck.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          //Free mode loops
          setCurrentIndex(0);
        }
      }
    } else {
      console.log("Wrong answer");
    }
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
              your terms alongside definitions choose a mode and begin reinforcing you material
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
              borderStyle: deck.length === 0 ? "dashed" : "solid",
            }}
          >
            {deck.length === 0 ? (
              /*Show upload options */
              <>
           
                <>
                  <>
                    <Stack spacing={1}>
                      <Typography variant="h6">
                      
                      </Typography>
                      <InputFileUpload
                        label="Uploaded Deck"
                        accept=".csv,.txt"
                        onFileSelect={(files) => handleDeckUpload(files)}
                      />
                      <Divider></Divider>
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
                  </>

                  <Stack spacing={2}>
                    <Button
                      fullWidth
                      variant={
                        sessionMode === "free" ? "contained" : "outlined"
                      }
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
                        Brute Force/FreeMode
                      </Typography>
                      <Typography variant="caption">
                        Just keeps cycling through the entire deck over and over
                        again
                      </Typography>
                    </Button>

                    <Button
                      fullWidth
                      variant={
                        sessionMode === "elimination" ? "contained" : "outlined"
                      }
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
                        elimination Mode
                      </Typography>
                      <Typography variant="caption">
                        Words are removed after you get them right a certain
                        amount of times
                      </Typography>
                    </Button>

                    <Button
                      fullWidth
                      variant={
                        sessionMode === "reverse" ? "contained" : "outlined"
                      }
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
                </>
                <Box sx={{ width: "100%", maxWidth: 600, mt: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 1,
                      textAlign: "left",
                      fontWeight: "bold",
                      color: "#aaa",
                    }}
                  >
                    Card order
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button
                      fullWidth
                      variant={!isRandomized ? "contained" : "outlined"}
                      onClick={() => setIsRandomized(false)}
                      sx={{
                        py: 1.5,
                        fontWeight: "bold",
                        textTransform: "none",
                      }}
                    >
                      Strict Order (Default)
                    </Button>
                    <Button
                      fullWidth
                      variant={isRandomized ? "contained" : "outlined"}
                      onClick={() => setIsRandomized(true)}
                      sx={{
                        py: 1.5,
                        fontWeight: "bold",
                        textTransform: "none",
                      }}
                    >
                      Randomized
                    </Button>
                  </Stack>
                </Box>
              </>
            ) : (
              /* State B */
              <Container maxWidth="md" sx={{ py: 2 }}>
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
                  <Stack spacing={2}>
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
                      variant="h1"
                      align="center"
                      sx={{ fontWeight: "bold", mt: 2 }}
                    >
                      {sessionMode === "reverse"
                      ? deck[currentIndex]?.definition
                      : sessionMode === 'elimination'
                      ? activePool[currentIndex]?. term
                      : deck[currentIndex]?. term}
                    </Typography>

                    <TextField
                      fullWidth
                      autoFocus
                      label=""
                      placeholder="Type translation"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      variant="filled"
                      slotProps={{
                        htmlInput: {
                          style: { textAlign: "center" },
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
              </Container>
            )}
          </Paper>
        </Box>

        <Accordion
         
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">About</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
             <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
  <strong>KingCard</strong> leverages systematic active recall mechanics to optimize memory retention 
</Typography>
<Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
  • <strong>Brute Force / Free Mode:</strong> An infinite iteration cycle through your entire loaded card index, excellent for initial exposure and casual review.
</Typography>
<Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
  • <strong>Elimination Mode:</strong> Tracks correct answers and filters successfully entered terms out of the pool until the session is cleared.
</Typography>
<Typography variant="body2" sx={{ color: "text.secondary" }}>
  • <strong>Reverse Mode:</strong> Flips the structural prompt rules completely, presenting definitions first 
</Typography>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Stack>
    </Container>
  );
}
