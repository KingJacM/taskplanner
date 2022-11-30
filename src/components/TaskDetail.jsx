import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import { Typography } from '@mui/material';
import { useState,useEffect} from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Alert from "@mui/material/Alert";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormLabel from '@mui/material/FormLabel';
import EditIcon from '@mui/icons-material/Edit';

import Select from "@mui/material/Select";

const config = require("../config.json");


export default function TaskDetail({note, milestone,setMilestone}) {
  const [open, setOpen] = React.useState(false);
  const [startValue, setStart] = React.useState(null);
  const [editDetails, setEditDetails] = useState(note.taskDetail);
  const [edit, setEdit] = useState(false)
  const [editStartValue, setEditStart] = React.useState(note.startDate);
  const [endValue, setEnd] = React.useState(note.endDate);
  const [title, setTitle] = useState(note.taskName);
  const [details, setDetails] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [hourError, setHourError] = useState(false);
  const [startError, setStartError] = useState(false);
  const [endError, setEndError] = useState(false);
  const [detailsError, setDetailsError] = useState(false);
  const [timesection, setTimesection] = useState(note.timeSection);
  const [disabled, setDisabled] = useState(false);
  const [hour, setHour] = useState(note.hourEachDay);
  const [alert, setAlert] = useState("");
  const [quantity, setQuantity] = useState(note.quantity);
  const [quantifier, setQuantifier] = useState(note.quantifier);
  const [quantityError, setQuantityError] = useState(false);
  const [quantifierError, setQuantifierError] = useState(false);

  let navigate = useNavigate();



  function custom_sort(a, b) {
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
}

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit=()=>{
    setDisabled(true);
      axios
        .post(`${config.api.invokeUrl}/milestone`, {
          "taskID":note.PK, "milestoneName":details, "deadline":startValue
        })
        .then(() => {navigate("/");setOpen(false);setDisabled(false);setMilestone([...milestone, {"milestoneName":details, "deadline":startValue}])})
        .catch((err) => console.log(err));
  }

  const handleUpdate=()=>{
    console.log("updating")
    setDisabled(true);
      axios
        .patch(`${config.api.invokeUrl}/tasks/${note.PK}`, {
          id:note.PK,
          taskName: title,
          taskDetail: editDetails,
          startDate: editStartValue,
          endDate: endValue,
          totalHours:hour*
          (differenceInCalendarDays(new Date(endValue), new Date(editStartValue)) + 1),
          timeSection: timesection,
          lastFinishDate: note.lastFinishDate,
          currentProgress: note.currentProgress,
          quantity: quantity,
          quantifier:quantifier,
          hourEachDay:hour
        })
        .then(() => {setOpen(false);setDisabled(false)})
        .catch((err) => console.log(err));
  }

  return (
    <>
    <div>
      
      <MoreHorizOutlinedIcon variant="outlined" onClick={handleClickOpen}>
        Open Task Detail
      </MoreHorizOutlinedIcon>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
        <Typography variant="h3">
        {note.taskName}
        </Typography>
        <EditIcon onClick={()=>{setEdit(!edit)}}></EditIcon>
        </DialogTitle>
        <DialogContent>
        {edit ? 
        <>
          <TextField
            onChange={(e) => setTitle(e.target.value)}
            label="Task Name"
            variant="outlined"
            color="secondary"
            defaultValue={note.taskName}
           
          />
          <TextField
            onChange={(e) => setEditDetails(e.target.value)}
            label="Details"
            variant="outlined"
            color="secondary"
            defaultValue={note.taskDetail}
      
        
          />
          \<InputLabel id="hour">Hours Each Day</InputLabel>
          <Select
            labelId="hour"
            id="hourSelect"
            value={hour}
            label="Hour"
            onChange={(e) => setHour(e.target.value)}
            
          >
            {[0.5, 1, 2, 3, 4, 5, 6].map((value) => (
              <MenuItem value={value}>{value}</MenuItem>
            ))}
          </Select>
          <TextField
            onChange={(e) => setQuantity(e.target.value)}
            label="quantity (in total)"
            variant="outlined"
            color="secondary"
            defaultValue={note.quantity}
          
          />
          <TextField
            onChange={(e) => setQuantifier(e.target.value)}
            label="quantifier"
            variant="outlined"
            color="secondary"
            defaultValue={note.quantifier}
      
          />
          <br></br>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={editStartValue}
            
              onChange={(newValue) => {
                setStart(newValue.toLocaleDateString());
              }}
              renderInput={(params) => <TextField {...params} />}
            />

            <DatePicker
              label="End Date"
              value={endValue}
              
              onChange={(newValue) => {
                setEnd(newValue.toLocaleDateString());
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <FormControl>
            <FormLabel>Time section</FormLabel>
            <RadioGroup
              value={timesection}
              onChange={(e) => setTimesection(e.target.value)}
            >
              <FormControlLabel
                value="Morning"
                control={<Radio />}
                label="Morning"
              />
              <FormControlLabel
                value="Afternoon"
                control={<Radio />}
                label="Afternoon"
              />
              <FormControlLabel
                value="Evening"
                control={<Radio />}
                label="Evening"
              />
            </RadioGroup>
          </FormControl>
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            disabled={disabled}
            onClick={handleUpdate}
            endIcon={<KeyboardArrowRightIcon />}
          >
            Submit
          </Button>
          </>
        : <><Typography variant="h5">
        Task Detail:
        </Typography>
            
        {note.taskDetail}
        <Typography variant="h5">
        Task duration:
        </Typography>
        <p>{note.startDate}-{note.endDate}</p>
        
        
        <Typography variant="h6">
        Doing {note.totalHours} hours of work over {differenceInCalendarDays(new Date(note.endDate),new Date(note.startDate))+1} days. It is planned to be done on {note.timeSection}.
        <p>{note.quantity ? `Planning to finish ${note.quantity} ${note.quantifier} in total.`:<></> }</p>
        </Typography>
        
        <Typography variant="h5">
        Task duration:
        </Typography>
        <p>{note.startDate}-{note.endDate}</p>
        <Typography variant="h5">
        Milestone:
        </Typography>

        {milestone.sort(custom_sort).map(milestone=>(<Typography variant="body">{milestone.milestoneName}, deadline {milestone.deadline}<br></br></Typography>))}
        
        <Typography variant="h5">

        
        Add Milestone:
        </Typography>
        <TextField
            onChange={(e) => setDetails(e.target.value)}
            label="Details"
            variant="outlined"
            color="secondary"
            fullWidth
            required
            error={detailsError}
          />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Deadline"
              value={startValue}
              error={startError}
              onChange={(newValue) => {
                setStart(newValue.toLocaleDateString());
              }}
              renderInput={(params) => <TextField {...params} />}
            />

          </LocalizationProvider>
          <Button
            onClick={()=>handleSubmit()}
            color="secondary"
            variant="contained"
            disabled={disabled}
            endIcon={<KeyboardArrowRightIcon />}
          >
            Add
          </Button></>}
        
       

        </DialogContent>
        
     
      </Dialog>
    </div>
    
    </>
            );
}