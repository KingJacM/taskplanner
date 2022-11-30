import React from "react";
import { Typography } from "@mui/material";
import Container from "@mui/material/Container";
import TaskCard from "../TaskCard";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import differenceInDays from "date-fns/differenceInDays";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";

const config = require("../../config.json");

export default function Tasks() {
  const [notes, setNotes] = useState([]);
  const [morning, setMorning] = useState([]);
  const [afternoon, setAfternoon] = useState([]);
  const [evening, setEvening] = useState([]);
  const [anytime, setAnytime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  let navigate = useNavigate();
  const date = new Date().toLocaleDateString();

  const handleDelete = (id) => {
    axios
      .delete(`${config.api.invokeUrl}/tasks/${id}`)
      .then(() => {
        setNotes(
          notes.filter((note) => {
            console.log(note.PK);
            return note.PK != id;
          })
        );

        // notes.forEach((note) => sortByTime(note))
      })
      .catch((err) => console.log(err));
  };

  const sortByTime = (note) => {
    if (note.timeSection == "Morning") {
      setMorning((morning) => [...morning, note]);
    } else if (note.timeSection == "Afternoon") {
      setAfternoon((afternoon) => [...afternoon, note]);
    } else if (note.timeSection == "Evening") {
      setEvening((evening) => [...evening, note]);
    } else if (note.timeSection == "Anytime") {
      setAnytime((anytime) => [...anytime, note]);
    }
  };

  const renderTask = (note) => {
    return differenceInDays(new Date(), new Date(note.startDate)) + 1 > 0 ? (
      <Grid item style={{ margin: "auto", padding: "20px" }} xs={10}>
        <div key={note.PK}>
          <TaskCard note={note} handleDelete={handleDelete} date={date} />
        </div>
      </Grid>
    ) : (
      <Grid item style={{ margin: "auto", padding: "20px" }} xs={10}>
        <div key={note.PK}>
          <h3>{note.taskName}</h3> Task not starting yet
        </div>
      </Grid>
    );
  };

  useEffect(() => {
    async function fetchTasks() {
      await axios
        .get(`${config.api.invokeUrl}/tasks`, {
          onDownloadProgress: (progressEvent) => {
            setProgress(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            );
            console.log(progressEvent.lengthComputable);
          },
        })
        .then(function (response) {
          console.log("i fire once");
          setNotes(response.data);
          setLoading(false);
          response.data.forEach((note) => sortByTime(note));
          console.log(morning);
        });
    }

    fetchTasks();
  }, []);

  return (
    <>
      {/* <CircularProgress variant="determinate" value={progress} /> */}

      <Grid container>
        <Grid item style={{ margin: "auto", padding: "20px" }} xs={10}>
          <Typography variant="h3">Morning</Typography>
          {loading ? <CircularProgress /> : <></>}
        </Grid>

        {morning.map((note) => renderTask(note))}

        <Grid item style={{ margin: "auto", padding: "20px" }} xs={10}>
          <Typography variant="h3">Afternoon</Typography>
          {loading ? <CircularProgress /> : <></>}
        </Grid>

        {afternoon.map((note) => renderTask(note))}

        <Grid item style={{ margin: "auto", padding: "20px" }} xs={10}>
          <Typography variant="h3">Evening</Typography>
          {loading ? <CircularProgress /> : <></>}
        </Grid>

        {evening.map((note) => renderTask(note))}
        <Grid item style={{ margin: "auto", padding: "20px" }} xs={10}>
          <Typography variant="h3">Anytime</Typography>
          {loading ? <CircularProgress /> : <></>}
        </Grid>

        {anytime.map((note) => renderTask(note))}
      </Grid>
    </>
  );
}
