"use client";

import {Container, Stack, Typography, Accordion, AccordionSummary, AccordionDetails, Paper, Button, TextField, Box, AccordionActions} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InputFileUpload from './components/buttons/InputFileUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Papa from 'papaparse';
import { useState } from 'react';

interface Flashcard {
  term: string;
  definition: string;
}

type modeType = 'free' | 'elimination' | 'reverse';

export default function Home(){
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [activePool, setActivePool] = useState<Flashcard[]>([]); //for elimation

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isFinished, setIsFinished] = useState(false);

  const [sessionMode, setSessionMode] = useState<modeType>('free');

  const handleDeckUpload = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    console.log('Processing deck...', file.name);

    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedCards: Flashcard[] = results.data.map((row: any) => ({
          term: row[0]?.trim() || '',
          definition: row[1]?.trim() || '',
        

        }));

        setDeck(parsedCards);
        setActivePool([...parsedCards]); 
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

  const handleClearDeck = () => {
    setDeck([]);
    setCurrentIndex(0);
    setUserInput('');
    setIsFinished(false);
  }

  const handleCheckAnswer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const currentCardList = sessionMode === 'elimination' ? activePool : deck;
    const currentCard = currentCardList[currentIndex];
    if (!currentCard) return;

    const targetAnswer = sessionMode === 'reverse' ? currentCard.term : currentCard.definition;


    if (userInput.toLowerCase().trim() === currentCard.definition.toLowerCase()) {
      setUserInput('');

      //Elimation mode answr flo
      if(sessionMode === 'elimination'){
        const updatedPool = activePool.filter((_, idx) => idx !== currentIndex)
        setActivePool(updatedPool);

        if(updatedPool.length === 0){
          setIsFinished(true);
        } else{
          setCurrentIndex(currentIndex >= updatedPool.length ? 0 : currentIndex);
        }
      }

      //Free Mode
      else{
        if (currentIndex < deck.length - 1){
          setCurrentIndex(currentIndex + 1);
        } else {
          //Free mode loops
          setCurrentIndex(0);
        }
      }
    }
    else {
      console.log('Wrong answer');
    }
  };

  return(
    <Container maxWidth="md" sx={{py: 8}}>
      <Stack spacing={1}>

    {/* Top section: title and intro content */}
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

    {/* Middle section: upload area and flashcard session */}
    <Accordion>
    <Paper variant='outlined' sx={{p:6, textAlign: 'center', borderStyle: deck.length === 0? 'dashed': 'solid'}}>

    {deck.length === 0 ? (
      /*Show upload options */
      <>
              
                <>
            
                  <Stack spacing={1}>
                    <Typography variant='h6'>File to be uploaded here</Typography>
                    <InputFileUpload label="Uploaded CSV" accept='.csv,.txt' onFileSelect={(files) => handleDeckUpload(files)} />
                  </Stack>

                  <Box sx={{ width: '100%', maxWidth: 600 }}>
                    <Typography variant='subtitle1' sx={{ mb: 2, textAlign: 'left', fontWeight: 'bold', color: '#aaa' }}>
                      Select Mode:
                    </Typography>
                  </Box></>
                  
                  
                  <Stack spacing={2}>
                 
                  <Button fullWidth variant={sessionMode === 'free' ? 'contained' : 'outlined'}
                  onClick={() => setSessionMode('free')}
                  sx={{py: 2, textTransform: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                  <Typography variant='button' sx={{fontWeight: 'bold', fontSize: '1.1rem' }}>Brute Force/FreeMode</Typography>
                  <Typography variant="caption">Just keeps cycling through the entire deck over and over again</Typography>
                  </Button>  

                   <Button fullWidth variant={sessionMode === 'elimination' ? 'contained' : 'outlined'}
                  onClick={() => setSessionMode('elimination')}
                  sx={{py: 2, textTransform: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                  <Typography variant='button' sx={{fontWeight: 'bold', fontSize: '1.1rem' }}>Brute Force/FreeMode</Typography>
                  <Typography variant="caption">Words are removed after you get them right a certain amount of times</Typography>
                  </Button>  

                  <Button fullWidth variant={sessionMode === 'reverse' ? 'contained' : 'outlined'}
                  onClick={() => setSessionMode('reverse')}
                  sx={{py: 2, textTransform: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                  <Typography variant='button' sx={{fontWeight: 'bold', fontSize: '1.1rem' }}>Brute Force/FreeMode</Typography>
                  <Typography variant="caption">Reverse the word and answer display target criteria</Typography>
                  </Button>  
                </Stack></>


    ) : (




      /* State B */
      <Container maxWidth="sm" sx={{py:2}}>
        <Box sx={{position: 'absolute', top:16, left:16}}>
        <Button startIcon={<ArrowBackIcon/>} onClick={handleClearDeck} color="inherit" sx={{textTransform: 'none',opacity: 0.7, '&:hover': {opacity: 1}}}>
        Change Deck
        </Button>
        </Box>


        {isFinished ? (
          <Stack spacing={2}>
            <Typography variant='h4'>Session Done</Typography>
            <Button variant='outlined' onClick={handleClearDeck}>Start Over</Button>
          </Stack>
        ) : (
          <Stack spacing={4} component='form' onSubmit={handleCheckAnswer}>

         

         

            <Typography variant='h1' align='center' sx={{fontWeight: 'bold', mt: 2}}>
            {deck[currentIndex]?.term}
            </Typography>

            <TextField fullWidth autoFocus label="" placeholder='Type translation' value={userInput} onChange={(e) => setUserInput(e.target.value)} variant='filled' slotProps={{htmlInput: {style: { textAlign: 'center' },'aria-label': 'answer-input'}}}/>

              <Typography variant='caption' align='center'>
                Card{currentIndex + 1} of {deck.length}
              </Typography>
</Stack>
        )}
      </Container>
    )}
    </Paper>
</Accordion>

  

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