import React, { } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../components/Home';

export const AppRoutes = (props) => {
  return (
    <Routes>
      <Route exact path='/' element={<Home {...props} />} />
    </Routes>
  )
}