import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import axios from 'axios';

const config = require("../config.json");
const columns = [
 
  {
    field: 'id',
    headerName: 'Task Name',
    width: 150,
    editable: true,
  },
  {
    field: 'detail',
    headerName: 'Task Detail',
    width: 150,
    editable: true,
  },
  {
    field: 'startDate',
    headerName: 'Start Date',
   
    width: 110,
    editable: true,
  },
  {
    field: 'finishDate',
    headerName: 'Finish Date',
    width: 160,
    
  },
//   {
//     field: 'hourEachDay',
//     headerName: 'hours Each day',
//     width: 160,
    
//   },
];


export default function Grid() {

    const [rows, setRows] = useState([])

    const insertRows = (note)=>{
        let newrow = {
            id: note.taskName,
            detail: note.taskDetail,
            startDate: note.startDate,
            finishDate: note.endDate,
            // hourEachDay: note.hourEachDay
        }
        
        setRows((rows) => [...rows, newrow])
        console.log(newrow)


    }

    useEffect(() => {
        async function fetchTasks() {
          await axios
            .get(`${config.api.invokeUrl}/tasks`)
            .then(function (response) {
              console.log(response.data);
            //   setRows(response.data)
              
           

              response.data.forEach((note) => {insertRows(note)});
            
            });
        }
    
        fetchTasks();
      }, []);

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        
      />
    </Box>
  );
}