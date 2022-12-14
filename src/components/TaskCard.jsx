import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import styled from "@emotion/styled";
import TaskDetail from "./TaskDetail";
import ProgressBar from "react-bootstrap/ProgressBar";
import { differenceInCalendarDays } from "date-fns";
import AlertDialog from "./AlertDialogue";

const config = require("../config.json");

export default function TaskCard({ note, handleDelete, date }) {
  const finished = note.lastFinishDate == date;
  const [endTask, setEndTask] = useState(
    note.currentProgress >= 100 ? "You have completed the whole task!" : ""
  );
  const progressToday =
    (100 - note.currentProgress) /
    (differenceInCalendarDays(new Date(note.endDate), new Date()) + 1);

  const [disabled, setDisabled] = useState(finished ? true : false);
  const [color, setColor] = useState(finished ? "success" : "primary");
  const buttonText = finished ? "completed" : "complete";
  const hasQuantity = note.quantity != null ? true : false;
  const CompleteButton = styled(Button)`
    &&& {
      &.Mui-disabled {
        color: white;
        background: lightgreen;
      }
    }
  `;

  const [milestone, setMilestone] = useState([]);

  useEffect(() => {
    async function fetchMilestones() {
      await axios
        .get(`${config.api.invokeUrl}/milestone/${note.PK}`)
        .then(function (response) {
          setMilestone(response.data);
        });
    }

    fetchMilestones();
    console.log("testing milestone out put: " + milestone);
  }, []);

  const handleUpdate = (progress) => {
    setDisabled(true);
    axios
      .patch(`${config.api.invokeUrl}/tasks/${note.PK}`, {
        id: note.PK,
        taskName: note.taskName,
        taskDetail: note.taskDetail,
        startDate: note.startDate,
        endDate: note.endDate,
        totalHours: note.totalHours,
        timeSection: note.timeSection,
        currentProgress: note.currentProgress + progress,
        lastFinishDate: date,
        quantity: note.quantity,
        quantifier: note.quantifier,
      })
      .then(setColor("success"));
  };

  function closestDate(d) {
    return differenceInCalendarDays(new Date(d.deadline), new Date()) >= 0;
  }

  const checkFinish = (note) => {
    // console.log(`${note.taskName} starts from ${note.startDate} and finishes at ${note.endDate}, today is ${new Date().toLocaleDateString()}to end date is ${differenceInCalendarDays(new Date(note.endDate), new Date()) + 1}`)

    if (finished == true || note.currentProgress >= 100) {
      return (
        <>
          <Typography variant="h5" color="success">
            {endTask}
          </Typography>

          <ProgressBar
            striped
            variant="success"
            now={note.currentProgress}
            key={1}
            label={`${note.currentProgress.toFixed(1)}%`}
          />

          <br></br>

          
        </>
      );
    } else {
      return (
        <>
          <Typography variant="h5" color="textSecondary">
            {Math.ceil(progressToday) + "% of work today"}
          </Typography>

          <Typography variant="h5" color="textSecondary">
            {"Hours today: " +
              ((progressToday / 100) * note.totalHours).toFixed(1)}
            <br></br>
            {note.timeSection}
            <br></br>
            {hasQuantity ? (
              `${Math.ceil(note.quantity * (progressToday / 100))} ${
                note.quantifier
              } today`
            ) : (
              <></>
            )}
          </Typography>
          <ProgressBar>
            <ProgressBar
              striped
              variant="success"
              now={note.currentProgress}
              key={1}
              label={`${note.currentProgress.toFixed(1)}%`}
            />
            <ProgressBar
              variant="warning"
              now={progressToday}
              key={2}
              label={`${progressToday.toFixed(1)}%`}
            />
          </ProgressBar>
          <br></br>
        
        </>
      );
    }
  };

  return (
    <div>
      <Card elevation={1}>
        <CardHeader
          action={
            <>
              <IconButton>
                <AlertDialog action={() => handleDelete(note.PK)}></AlertDialog>
              </IconButton>
              <IconButton>
                <TaskDetail
                  note={note}
                  milestone={milestone}
                  setMilestone={setMilestone}
                ></TaskDetail>
              </IconButton>
            </>
          }
          title={note.taskName}
        />

        <CardContent>
          <Typography variant="body2" color="textSecondary">
            {note.taskDetail}
          </Typography>
          {milestone.filter(closestDate)[0] != null ? (
            "Upcoming milestone: " +
            milestone.filter(closestDate)[0].milestoneName +
            " " +
            milestone.filter(closestDate)[0].deadline
          ) : (
            <></>
          )}

          {checkFinish(note)}
          <CompleteButton
            variant="contained"
            color={color}
            disabled={disabled}
            onClick={() => handleUpdate(progressToday)}
          >
            {buttonText}
          </CompleteButton>
        </CardContent>
        
      </Card>
    </div>
  );
}
