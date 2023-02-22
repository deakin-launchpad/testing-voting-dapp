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
import algosdk, { waitForConfirmation } from "algosdk";

// TODO1: Connect to the algorand node
const client = new algosdk.Algodv2(
  '',
  'https://testnet-api.algonode.cloud',
  443
);
// TODO1: Provide the app ID on testnet
const EncodeBytes = (utf8String) => {
	let enc = new TextEncoder();
	return enc.encode(utf8String);
}

const DecodeBase64 = (base64) => {
  return Buffer.from(base64, 'base64').toString('utf8');
};

const constantParams = ["choose", "governor_token", "min_token_to_vote", "proposal", "result_box", "total_number_of_options", "voting_end"];
let options = [];
let governorId;
let optIn = false;
const Vote = (props) => {
  const [governorToken, setGovernorToken] = useState(null);
  const [currentProposal, setCurrentProposal] = useState(null);
  const [currentVoting, setCurrentVoting] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCurrentVoting = useCallback(async () => {
    try {
      setLoading(true);
      const app = await client.getApplicationByID(governorId).do();
      if (!!app.params['global-state'][0].value.uint) {
        console.log("detected");
        let votingStatus = [];
        for (const property in app.params['global-state']) {
          let optionKey = DecodeBase64(app.params['global-state'][property].key);
          let optionValue = app.params['global-state'][property].value.uint;
          let proposalValue = DecodeBase64(app.params['global-state'][property].value.bytes);
          if (!constantParams.includes(optionKey)){
            let optionStatus = String(optionKey + ": " + optionValue);
            votingStatus.push(optionStatus);
          }
          else if(optionKey == "proposal"){
            setCurrentProposal(proposalValue);
          }
        };
        setCurrentVoting(votingStatus.toString());
        console.log("voting retrieved");
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      console.error("There was an error connecting to the algoland ndoe", e);
    }
  }, []);
  useEffect(() => {
    getCurrentVoting();
  }, [getCurrentVoting]);

  const getCurrentOptions = useCallback(async () => {
    try {
      setLoading(true);
      governorId = parseInt(
        document.getElementById('governorId').value
      );
      console.log("governor ID:" + governorId);
      const app = await client.getApplicationByID(governorId).do();
      if (!!app.params['global-state'][0].value.uint) {
        console.log("detected");
        let currentOptions = [];
        for (const property in app.params['global-state']) {
          if (!constantParams.includes(DecodeBase64(app.params['global-state'][property].key))){
            currentOptions.push({ label: DecodeBase64(app.params['global-state'][property].key), value: DecodeBase64(app.params['global-state'][property].key)})
          }
          else if("governor_token" === DecodeBase64(app.params['global-state'][property].key)){
            setGovernorToken(app.params['global-state'][property].value.uint);
          };
        };
        options = currentOptions;
        console.log(options);
        console.log(governorToken);
        getCurrentVoting();
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      console.error("There was an error connecting to the algoland ndoe", e);
    }
  }, []);
  useEffect(() => {
    getCurrentOptions();
  }, [getCurrentOptions]);

  const handleVoting = async (e) => {
    // Prevent the browser from reloading the page
    e.preventDefault();
    // Read the form data
    const form = e.target;
    const formData = new FormData(form);
    // You can work with it as a plain object.
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
    const voted = formJson.votedIdea;
    console.log(voted);
    try {

      const suggestedParams = await client.getTransactionParams().do();
      const appArgs = [
        EncodeBytes("vote"),
        EncodeBytes(voted),];
      const foreignAcc = undefined;
      const foreignApp = undefined;
      const foreignAsset = [governorToken];
      const accountInfo = await client.accountInformation(props.address).do();
      const optedInApp = accountInfo["apps-local-state"];
      console.log(optedInApp.length);
      for (const property in optedInApp){
        if (governorId == optedInApp[property].id){
          optIn = true;
          break;
        };
      };
      console.log(optIn);
      if (!optIn){
        console.log("===OPTIN===");
        const transactionOptin = algosdk.makeApplicationOptInTxn(
          props.address,
          suggestedParams,
          governorId,
        )
        const signedTxOptin = await props.myAlgo.signTransaction(transactionOptin.toByte());
        console.log(signedTxOptin);
        console.log(signedTxOptin.blob);
        const sentTxOptin = await client.sendRawTransaction(signedTxOptin.blob).do();
        const resultOptin = await waitForConfirmation(client, sentTxOptin.txId, 4);
        alert(`Result: ${JSON.stringify(resultOptin)}`);
        console.log("===VOTING===");
        const transactionVote = algosdk.makeApplicationNoOpTxn(
          props.address,
          suggestedParams,
          governorId,
          appArgs,
          foreignAcc,
          foreignApp,
          foreignAsset
        );
        console.log(appArgs);
        console.log(foreignAsset);
        const signedTxVote = await props.myAlgo.signTransaction(transactionVote.toByte());
        console.log(signedTxVote);
        console.log(signedTxVote.blob);
        const sentTxVote = await client.sendRawTransaction(signedTxVote.blob).do();
        const resultVote = await waitForConfirmation(client, sentTxVote.txId, 4);
        alert(`Result: ${JSON.stringify(resultVote)}`);
        getCurrentVoting();
        console.log("voted");
      }
      else{
        console.log("===VOTING===");
        const transactionVote = algosdk.makeApplicationNoOpTxn(
          props.address,
          suggestedParams,
          governorId,
          appArgs,
          foreignAcc,
          foreignApp,
          foreignAsset
        );
        console.log(appArgs);
        console.log(foreignAsset);
        // const transactionDetails = [
        //   { txn: transaction, signers: [props.account] }];
        const signedTxVote = await props.myAlgo.signTransaction(transactionVote.toByte());
        console.log(signedTxVote);
        console.log(signedTxVote.blob);
        const sentTxVote = await client.sendRawTransaction(signedTxVote.blob).do();
        const resultVote = await waitForConfirmation(client, sentTxVote.txId, 4);
        alert(`Result: ${JSON.stringify(resultVote)}`);
        getCurrentVoting();
        console.log("voted");
      }
    } catch (e) {
      setLoading(false);
      console.error(`There was an error calling the smart contract app: ${e}`);
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
              {currentProposal ?? "Voting proposal"}
            </Typography>
            <Typography
              component="h6"
              variant="h6"
              sx={{ fontWeight: "bold", textAlign: "center", color: "#16BCBC" }}
            >
              {currentVoting ?? "Voting progress"}
            </Typography>
          </Grid>
        </Grid>

        <TextField
          id="governorId"
          label="Enter a governor ID"
          helperText="Retrieve options from the governor"
        />

        <form method="post" onSubmit={handleVoting}>
          <label>
            Vote an idea:
            <select name="votedIdea">
              {options.map((option) => (
                <option value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <hr />
          <button type="reset">Reset</button>
          <button type="submit">Submit</button>
        </form>
        
        <Grid item>
            <Typography
              component="h6"
              variant="h6"
              sx={{ fontWeight: "bold", textAlign: "center" }}
            >
              Required Governor Token
            </Typography>
            <Typography
              component="h6"
              variant="h6"
              sx={{ fontWeight: "bold", textAlign: "center", color: "#16BCBC" }}
            >
              {governorToken ?? "NaN"}
            </Typography>
          </Grid>

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
          onClick={() => getCurrentOptions()}
        >
          {loading ? (
            <CircularProgress disableShrink sx={{ color: "white" }} />
          ) : (
            "Get Options"
          )}
        </Button>

      </Container>
    </Box>
  );
};

export default Vote;