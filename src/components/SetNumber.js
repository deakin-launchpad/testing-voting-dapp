import React, { useCallback, useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import algosdk, { waitForConfirmation, encodeUint64 } from "algosdk";

// TODO1: Connect to the algorand node
const client = new algosdk.Algodv2(
  '',
  'https://testnet-api.algonode.cloud',
  443
);
// TODO1: Provide the app ID on testnet
const appIndex = 118294267;
const SetNumber = (props) => {
  const [currentNumber, setCurrentNumber] = useState(null);
  const [loading, setLoading] = useState(false);

  // TODO2: Use the Algorand client to get the current number from the smart contract
  const getCurrentNumber = useCallback(async () => {
    try {
      setLoading(true);
      const app = await client.getApplicationByID(appIndex).do();
      // const last_element = app.params['global-state'].length - 1;
      // console.log("pass");
      // console.log(app.params['global-state'][last_element].value.uint);
      // console.log(last_element);
      // console.log(app.params['global-state'][0].value);
      // console.log(app.params);
      if (!!app.params['global-state'][0].value.uint) {
        console.log("detected");
        setCurrentNumber(app.params['global-state'][0].value.uint);
        console.log("changed");
        setLoading(false);
      } else {
        setCurrentNumber(0);
        setLoading(false);
        // console.log("detecting false");
      }
    } catch (e) {
      setLoading(false);
      console.error("There was an error connecting to the algoland ndoe", e);
    }
  }, []);
  useEffect(() => {
    getCurrentNumber();
  }, [getCurrentNumber]);

  // TODO3: Use the Algorand client to set the current number to the new number
  const setNumber = async () => {
    try {
      setLoading(true);
      const numberToSet = parseInt(
        document.getElementById('number-to-set').value
      );
      console.log("number to set:" + numberToSet);
      const suggestedParams = await client.getTransactionParams().do();
      const appArgs = [
        new Uint8Array(Buffer.from("set_number")),
        encodeUint64(numberToSet)];
      const transaction = algosdk.makeApplicationNoOpTxn(
        props.account,
        suggestedParams,
        appIndex,
        appArgs
      );
      console.log(appArgs);
      const transactionDetails = [
        { txn: transaction, signers: [props.account] }];
      const signedTx = await props.wallet.signTransaction([transactionDetails]);
      const { txId } = await client.sendRawTransaction(signedTx).do();
      const result = await waitForConfirmation(client, txId, 2);
      alert(`Result: ${JSON.stringify(result)}`);
      getCurrentNumber();
      console.log("successful get number");
    } catch (e) {
      setLoading(false);
      console.error(`There was an error calling the counter app: ${e}`);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100% - 64px)",
      }}
    >
      <Container
        style={{
          margin: "auto auto",
        }}
        maxWidth="md"
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          px: {
            md: "130px !important",
          },
        }}
      >
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item>
            <Typography
              component="h6"
              variant="h6"
              sx={{ fontWeight: "bold", textAlign: "center" }}
            >
              Current number
            </Typography>
            <Typography
              component="h6"
              variant="h6"
              sx={{ fontWeight: "bold", textAlign: "center", color: "#16BCBC" }}
            >
              {currentNumber ?? "NaN"}
            </Typography>
          </Grid>
        </Grid>

        <TextField
          id="number-to-set"
          label="Enter a number"
          helperText="Your number will be sent to the smart contract"
        />

        <Button
          sx={{
            backgroundColor: "#00554E",
            color: "white",
            width: 200,
            height: 50,
            borderRadius: 5,
            margin: 5,
            ":hover": {
              bgcolor: "black",
            },
          }}
          onClick={() => setNumber()}
        >
          {loading ? (
            <CircularProgress disableShrink sx={{ color: "white" }} />
          ) : (
            "Set new number"
          )}
        </Button>

      </Container>
    </Box>
  );
};

export default SetNumber;