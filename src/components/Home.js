import React, { } from 'react';
import { Box } from '@mui/material';
import WalletConnect from './WalletConnect';


const Home = (props) => {
  return (
    <Box sx={{
      backgroundColor: 'background.default',
      display: 'flex', flexDirection: 'column',
      minHeight: 'calc(100% - 64px)'
    }}>
      <WalletConnect />
    </Box>
  )
}

export default Home;
