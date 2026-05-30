import { createTheme } from "@mui/material/styles";

//Built in MUI function
const theme = createTheme({
    palette:{
        mode: 'dark',
        background:{
            default: '#1a1b1e',
            //Colour of raised surfaces/the background of certain elements like accordian
            paper: '#25262b',
        },
        //Used for submit button or active state of text field
        primary:{
            main: '#ffffff'
        },
        error:{
            main:'#ff4d4d'
        },
        success:{
            main: '#4caf50'
        },
    },

    typography:{
        fontFamily: 'Inter, sans-serif',
        h4:{
            fontWeight: 700,
            fontStyle: 'italic'
        },
        body1:{
            fontSize: '0.95rem',
            color: '#b0b0b0'
        },
    },

    components:{
        MuiPaper:{
            styleOverrides:{
                root:{
                    //makes cards flat
                    backgroundImage: 'none',
                    borderRadius: '4px',
                },
            },
        },

    MuiAccordionSummary:{
        styleOverrides: {
            root:{
                backgroundColor: '#141517'
            },
        },
    },

    MuiAccordion:{
        styleOverrides: {
            root:{
                backgroundColor: '#25262b',
                border: '1px solid #2a2a2a',
                '&:before': {display: 'none'}

            },
        },
    },

    
    },
    });

    export default theme;