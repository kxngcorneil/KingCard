"use client";

import {Container, Stack, Typography, Accordion, AccordionSummary, AccordionDetails, Paper, Button, TextField} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InputFileUpload from './components/buttons/InputFileUpload';
import Papa from 'papaparse';
import { useState } from 'react';

interface Flashcard {
  term: string;
  definition: string;
}

export default function Home(){
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isFinished, setIsFinished] = useState(false);

  const handleDeckUpload = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    console.log('Processing deck...', file.name);

    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedCards = results.data.map((row: any) => ({
          term: row[0]?.trim(),
          definition: row[1]?.trim(),
        }));

        setDeck(parsedCards);
        setCurrentIndex(0);
        setUserInput('');
        setIsFinished(false);
        console.log(parsedCards);
      },
      error(error) {
        console.error('Error importing deck', error.message);
      },
    });
  };

  const handleCheckAnswer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const currentCard = deck[currentIndex];
    if (!currentCard) return;

    if (userInput.toLowerCase().trim() === currentCard.definition.toLowerCase()) {
      setUserInput('');
      if (currentIndex < deck.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setIsFinished(true);
      }
    } else {
      console.log('Wrong answer');
    }
  };

  return(
    <Container maxWidth="md" sx={{py: 8}}>
      <Stack spacing={1}>

    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography variant="h4">KingCard</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
        </Typography>
      </AccordionDetails>
    </Accordion>

    <Paper variant='outlined' sx={{p:6, textAlign: 'center', borderStyle: 'dashed'}}>
    <Typography variant='h6'>File will be uploaded here</Typography>
    <InputFileUpload label="Upload CSV" accept=".csv,.txt" onFileSelect={handleDeckUpload} />

      <Container maxWidth="sm" sx={{py: 8}}>
    {isFinished ? (
      <Paper sx={{p: 4, textAlign: 'center'}}>
        <Typography variant="h4">Session Done</Typography>
        <Button onClick={() => window.location.reload()}>Star over</Button>
      </Paper>
    ) : deck.length > 0 ? (
      <Stack spacing={4} component="form" onSubmit={handleCheckAnswer}>

        <Typography variant='h1' align="center" sx={{fontWeight: 'bold'}}>
        {deck[currentIndex].term}
        </Typography>

        <TextField fullWidth autoFocus label="" value={userInput} onChange={(e) => setUserInput(e.target.value)}
        variant="filled"
        />

        <Typography variant="caption" align="center">
          Card {currentIndex + 1} of {deck.length}
        </Typography>
      </Stack>
    ) : null
  }
    
    </Container>
    </Paper>


  

    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography variant='h4'>About</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum

        </Typography>
      </AccordionDetails>
    </Accordion>

      </Stack>
    </Container>
  )
}