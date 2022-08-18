import React, { useCallback, useEffect, useState } from 'react';
import { Container, Box, Typography, Grid, Button, TextField } from '@mui/material';
import algosdk, { waitForConfirmation, encodeUint64 } from 'algosdk';

// TODO1: Connect to the algorand node

// TODO1: Provide the app ID on testnet

const SetNumber = (props) => {
  const [currentNumber, setCurrentNumber] = useState(null);

  // TODO2: Use the Algorand client to get the current number from the smart contract


  // TODO3: Use the Algorand client to set the current number to the new number
  const setNumber = async () => {

  }

  return (
    <Box sx={{
      backgroundColor: 'background.default',
      display: 'flex', flexDirection: 'column',
      minHeight: 'calc(100% - 64px)'
    }}>
      <Container style={{
        margin: 'auto auto'
      }}
        maxWidth="md"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          px: {
            md: '130px !important'
          }
        }}>

        <Grid container direction="row" alignItems='center' justifyContent='center'>
          <Grid item>
            <Typography component="h6" variant='h6' sx={{ fontWeight: "bold", textAlign: 'center' }}>
              Current number
            </Typography>
            <Typography component="h6" variant='h6' sx={{ fontWeight: "bold", textAlign: 'center', color: "#16BCBC" }}>
              {currentNumber ?? "NaN"}
            </Typography>
          </Grid>
        </Grid>

        <TextField
          id="number-to-set"
          label="Enter a number"
          helperText="Your number will be sent to the smart contract"
        />

        <Button sx={{
          backgroundColor: "#00554E",
          color: "white",
          width: 200,
          height: 50,
          borderRadius: 5,
          margin: 5,
          ':hover': {
            bgcolor: 'black',
          },
        }}
          onClick={() => setNumber()}
        >
          Submit
        </Button>

      </Container>
    </Box>
  )
}

export default SetNumber;
