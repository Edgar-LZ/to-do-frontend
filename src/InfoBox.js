import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import { useContext } from 'react';
import { ToDoContext } from './ToDoList';

export default function InfoBox() {
    const {rows, setRows, pages, setPages, currentPage, setCurrentPage, urlParams, setUrlParams, baseuri, setBaseUri, averageTime, setAverageTime}  = useContext(ToDoContext);
  return (
    <Box sx={{ flexGrow: 1, p: 5 }}>
    <Grid container spacing={1} sx={{  p: 5, border: '2px solid lightgray',}}>
      <Grid item xs={12} sm={4}>
        <Box sx={{  p: 2 }}>
          Average time to finish tasks:
        </Box>
      </Grid>
      <Grid item xs={12} sm={4}>
       
      </Grid>
      <Grid item xs={12} sm={4}>
        <Box sx={{ p: 2 }}>
          Average time to finish tasks by priority:
        </Box>
      </Grid>


      <Grid item xs={12} sm={4}>
        <Box sx={{  p: 2 }}>
          {averageTime.all}
        </Box>
      </Grid>
      <Grid item xs={12} sm={4}>
    
      </Grid>
      <Grid item xs={12} sm={4}>
        <Box sx={{  p: 2 }}>
          Low: {averageTime.low}
        </Box>
        <Box sx={{ p: 2 }}>
          Medium: {averageTime.medium}
        </Box>
        <Box sx={{p: 2 }}>
          High: {averageTime.high}
        </Box>
      </Grid>
    </Grid>
    </Box>
  );
}

