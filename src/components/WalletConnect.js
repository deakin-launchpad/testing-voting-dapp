import React, { useEffect, useState } from 'react';
import { Container, Box, Card, CardMedia, Typography, Grid, Button } from '@mui/material';
import LogoProfile from '../assets/logo_profile.png';
import { PeraWalletConnect } from '@perawallet/connect';
import MyAlgoConnect from "@randlabs/myalgo-connect";
import algosdk, { } from 'algosdk';
import Vote from './voting';

const myAlgoWallet = new MyAlgoConnect();
const myAlgoWalletSettings = {
  shouldSelectOneAccount: true,
  openManager: false,
};
// Initialize the PeraWalletConnect instance
// const peraWallet = new PeraWalletConnect();

// Initialize an Algorand client
const client = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', 443);

// const MINIMUM_ALGO_AMOUNT = 100000;

const WalletConnect = (props) => {
  // const [algoAccount, setAlgoAccount] = useState(null);
  const [accountAddress, setAccountAddress] = useState(null);
  // const [accountInfo, setAccountInfo] = useState(null);
  const isConnectedToWallet = !!accountAddress;

  // useEffect(() => {
  //   myAlgoWallet
  //     .connect(myAlgoWalletSettings)
  //     .then((account) => {
  //       setAccountAddress(account[0].address);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  //   // Connect to Pera Wallet on load
  //   // This will help if user previously connected to Pera Wallet
  //   peraWallet.reconnectSession().then((accounts) => {
  //     // Disconnection event listener
  //     peraWallet.connector?.on('disconnect', handleDisconnectWalletClick);

  //     if (accounts.length > 0) {
  //       setAlgoAccount(accounts[0]);
  //     }
  //   })
  // }, []);

  // useEffect(() => {
  //   if (algoAccount) {
  //     client.accountInformation(algoAccount).do().then((accountInfo) => {
  //       setAccountInfo(accountInfo);
  //     }).catch((err) => {
  //       console.log(err);
  //     });
  //   }
  // }, [algoAccount]);

  const handleConnectWalletClick = () => {
    myAlgoWallet
      .connect(myAlgoWalletSettings)
      .then((account) => {
        setAccountAddress(account[0].address);
      })
      .catch((error) => {
        console.log(error);
      });
    // peraWallet.connect().then((newAccounts) => {
    //   peraWallet.connector?.on('disconnect', handleDisconnectWalletClick);
    //   setAlgoAccount(newAccounts[0]);
    // });
  }

  // const handleDisconnectWalletClick = () => {
  //   peraWallet.disconnect();
  //   setAlgoAccount(null);
  //   setAccountInfo(null);
  // }

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
          <Grid item xs={4}></Grid>

          <Grid item xs={4}>
            <Card sx={{ borderRadius: 5, width: 100, elevation: 10, margin: 'auto' }}>
              <CardMedia
                component="img"
                image={LogoProfile}
              />
            </Card>
          </Grid>
          <Grid item xs={4}></Grid>
        </Grid>

        <Grid container direction="row" alignItems='center' justifyContent='center'>
          <Grid item>
            <Typography component="h6" variant='h6' sx={{ fontWeight: "bold", textAlign: 'center' }}>
              {accountAddress?? "No account connected"}
            </Typography>
          </Grid>
        </Grid>

        {/* <Typography component="p" variant='body1' sx={{ fontWeight: "bold", mt: 2, mb: 2 }}>
          {accountInfo?.amount ? accountInfo?.amount / 1000000 : "0"} ALGOs
        </Typography> */}

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
          // onClick={isConnectedToPeraWallet ? handleDisconnectWalletClick : handleConnectWalletClick}
          onClick={handleConnectWalletClick}
        >
          {"Connect to Pera Wallet"}
          {/* {isConnectedToPeraWallet ? "Disconnect" : "Connect to Pera Wallet"} */}
        </Button>

        {isConnectedToWallet
          ? <Vote myAlgo={myAlgoWallet} address={accountAddress} />
          : null}

      </Container>
    </Box>

  )
}

export default WalletConnect;
