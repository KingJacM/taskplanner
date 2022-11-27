import React from "react"
import { Typography } from "@mui/material"
import Container from "@mui/material/Container"
import TaskCard from "../TaskCard"
import { useState,useEffect } from "react"
import { useNavigate } from "react-router"
import axios from "axios"
import differenceInDays from "date-fns/differenceInDays"
import Grid from "@mui/material/Grid"
import CircularProgress from "@mui/material/CircularProgress"

const config = require('../../config.json')



export default function Tasks() {
    const [notes, setNotes] = useState([
    ]);

    const [progress, setProgress]=useState(0)
    let navigate = useNavigate();
    const date = new Date().toLocaleDateString() 

    const handleDelete = (id)=>{
      axios.delete(`${config.api.invokeUrl}/tasks/${id}`).then(() => navigate('/')).catch((err)=>console.log(err))
    }

    useEffect(() => {
      async function fetchTasks(){
        await axios.get(`${config.api.invokeUrl}/tasks`,{
          onDownloadProgress: (progressEvent) => {
            setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
            console.log(progressEvent.lengthComputable)
      
          }
        }).then(function (response) {
          setNotes(response.data);
          console.log(response);
        });
      }

      fetchTasks()
      
    },[]);

    

    return (
      <>
      {/* <CircularProgress variant="determinate" value={progress} /> */}

     <Grid container>
        
        
            {notes.map(note => (
              differenceInDays(new Date(), new Date(note.startDate))+1 > 0?
              <Grid item style={{"margin":"auto", "padding":"20px"}} xs={10}>
                <div key={note.PK}>
                <TaskCard note={note} handleDelete={handleDelete} date={date}/>
              </div>
              </Grid>:<Grid item style={{"margin":"auto", "padding":"20px"}} xs={10}><div key={note.PK}><h2>{note.taskName}</h2> Task not starting yet</div></Grid>
            ))}
          
       
        </Grid>
        </>
      )
}

