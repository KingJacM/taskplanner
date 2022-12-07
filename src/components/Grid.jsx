import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import axios from 'axios';

const config = require("../config.json");
const columns = [
 
  {
    field: 'id',
    headerName: 'ID',
    width: 150,
    
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
    editable: true,
  },
  {
    field: 'countries',
    headerName: 'Countries',
   
    width: 110,
    editable: true,
  },{
    field: 'gender',
    headerName: 'Gender',
   
    width: 110,
    editable: true,
  },
  {
    field: 'dob',
    headerName: 'Date Of Birth',
    width: 160,
    editable: true,
  },
  {
    field: 'truePositiveCount',
    headerName: 'True positive count',
    width: 160,
    
  },
  {
    field: 'createdDateTimeISO',
    headerName: 'createdDateTimeISO',
    width: 160,
    
  },
  {
    field: 'lastUpdatedDateTimeISO',
    headerName: 'lastUpdatedDateTimeISO',
    width: 160,
    
  }
];


export default function Grid() {

    const [rows, setRows] = useState([
      {
        name: "Boyko Borissov",
        countries: [
          "US"
        ],
        dob: "1994-08-22",
        gender: "male",
        id: "ABC4043",
        truePositiveCount: 0,
        createdDateTimeISO: "2021-10-05T10:10:08.270Z",
        lastUpdatedDateTimeISO: "2021-10-05T10:10:08.270Z"
      },
      {
        name: "Alice Somebody",
        countries: [
          "NZ"
        ],
        dob: "1999-08-22",
        gender: "female",
        id: "ABC4143",
        truePositiveCount: 2,
        createdDateTimeISO: "2021-11-05T10:10:08.270Z",
        lastUpdatedDateTimeISO: "2021-12-05T10:10:08.270Z"
      },
      {
        name: "Bob Bo",
        countries: [
          "CN"
        ],
        dob: "1984-08-22",
        gender: "male",
        id: "ABC1243",
        truePositiveCount: 0,
        createdDateTimeISO: "2021-10-15T10:10:08.270Z",
        lastUpdatedDateTimeISO: "2021-11-05T10:10:08.270Z"
      },{
        name: "Steve Dragonov",
        countries: [
          "AUS"
        ],
        dob: "1980-08-22",
        gender: "male",
        id: "ABC4343",
        truePositiveCount: 4,
        createdDateTimeISO: "2021-10-15T10:10:08.270Z",
        lastUpdatedDateTimeISO: "2021-12-05T10:10:08.270Z"
      }
    ])

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

    // useEffect(() => {
    //     async function fetchTasks() {
    //       await axios
    //         .get(`${config.api.invokeUrl}/tasks`)
    //         .then(function (response) {
    //           console.log(response.data);
    //         //   setRows(response.data)
              
           

    //           response.data.forEach((note) => {insertRows(note)});
            
    //         });
    //     }
    
    //     fetchTasks();
    //   }, []);

  return (
    <Box sx={{ margin:"auto", height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection //import checkbox selection function
        
      />
    </Box>
  );
}