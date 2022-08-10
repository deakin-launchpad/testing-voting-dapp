import React, { } from 'react';
import { AppBar, Toolbar, Grid, Typography } from '@mui/material';

const NavBar = (props) => {
  return (
    <AppBar position="static" sx={{ backgroundColor: 'transparent' }}>
      <Toolbar>
        <Grid container alignItems='center' justifyContent='space-around'>
          <Grid item>
            <Typography variant={'h6'} sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}>{props.title}</Typography>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

export default NavBar;
