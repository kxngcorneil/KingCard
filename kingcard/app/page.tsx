import {Container, Stack, Typography, Accordion, AccordionSummary, AccordionDetails, Paper, Button} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Home(){
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
    <Button variant="outlined">Button</Button>
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