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

const config = require("../config.json");


export default function TaskDetail({note}) {
  const [open, setOpen] = React.useState(false);
  const [startValue, setStart] = React.useState(null);
  const [details, setDetails] = useState(null);
  const [startError, setStartError] = useState(false);
  const [detailsError, setDetailsError] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [milestone, setMilestone]=useState([])
  let navigate = useNavigate();

  useEffect(() => {
    async function fetchMilestones(){
      await axios.get(`${config.api.invokeUrl}/milestone/${note.PK}`
      ).then(function (response) {
        setMilestone(response.data);
        console.log(response);
      });
    }

    fetchMilestones()
    
  },[]);

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
        .then(() => {navigate("/");setOpen(false);setDisabled(false)})
        .catch((err) => console.log(err));
  }

  return (
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
        </DialogTitle>
        <DialogContent>
        <Typography variant="h5">
        Task Detail:
        </Typography>
            
        {note.taskDetail}
        <Typography variant="h5">
        Task duration:
        </Typography>
        {note.startDate}-{note.endDate}
        <Typography variant="h5">
        Milestone:
        </Typography>

        {milestone.map(milestone=>(<Typography variant="body">{milestone.milestoneName}, deadline {milestone.deadline}<br></br></Typography>))}
        
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
            Submit
          </Button>
       

        </DialogContent>
        
     
      </Dialog>
    </div>
  );
}