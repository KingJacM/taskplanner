import React from "react";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useNavigate } from "react-router";
import { useState } from "react";
import axios from "axios";
import Alert from "@mui/material/Alert";
import { differenceInCalendarDays } from "date-fns";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

import Select from "@mui/material/Select";

const config = require("../../config.json");
export default function Create() {
  const [startValue, setStart] = React.useState("");
  const [endValue, setEnd] = React.useState("");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [hourError, setHourError] = useState(false);
  const [startError, setStartError] = useState(false);
  const [endError, setEndError] = useState(false);
  const [detailsError, setDetailsError] = useState(false);
  const [category, setCategory] = useState("Anytime");
  const [disabled, setDisabled] = useState(false);
  const [hour, setHour] = useState(1);
  const [alert, setAlert] = useState("");
  const [quantity, setQuantity] = useState(null);
  const [quantifier, setQuantifier] = useState("units");
  const [quantityError, setQuantityError] = useState(false);
  const [quantifierError, setQuantifierError] = useState(false);

  let navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setTitleError(false);
    setDetailsError(false);

    if (title == "") {
      setTitleError(true);
      setAlert("set title");
    } else if (details == "") {
      setDetailsError(true);
      setAlert("set details");
    } else if (hour == "") {
      setHourError(true); //differenceInDays(new Date(endValue),new Date(startValue))+1
      setAlert("set hours");
    } else if (startValue == "") {
      setStartError(true);
      setAlert("set start date");
    } else if (endValue == "") {
      setEndError(true);
      setAlert("set end date");
    } else if (differenceInCalendarDays(new Date(endValue), new Date()) < 0) {
      setStartError(true);
      setEndError(true);
      setAlert("Cannot enter overdue tasks");
    }

    //end date before start dat
    else if (
      differenceInCalendarDays(new Date(endValue), new Date(startValue)) < 0
    ) {
      setStartError(true);
      setEndError(true);
      setAlert("End date cannot be before start date");
      //current date after the end day
    } else if (title && details && startValue && endValue && hour) {
      setDisabled(true);
      axios
        .post(`${config.api.invokeUrl}/tasks/${details}`, {
          id: details,
          taskname: title,
          taskName: title,
          taskDetail: details,
          startDate: startValue,
          endDate: endValue,
          totalHours:
            hour *
            (differenceInCalendarDays(
              new Date(endValue),
              new Date(startValue)
            ) +
              1),
          timeSection: category,
          lastFinishDate: "",
          quantity: quantity,
          quantifier: quantifier,
          hourEachDay: hour,
        })
        .then(() => navigate("/"))
        .catch((err) => console.log(err));
    }
  };

  return (
    <>
      <Container size="sm">
        <Typography
          variant="h6"
          color="textSecondary"
          component="h2"
          gutterBottom
        >
          Create a New Note
        </Typography>

        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <TextField
            onChange={(e) => setTitle(e.target.value)}
            label="Task Name"
            variant="outlined"
            color="secondary"
            fullWidth
            required
            error={titleError}
          />
          <TextField
            onChange={(e) => setDetails(e.target.value)}
            label="Details"
            variant="outlined"
            color="secondary"
            multiline
            rows={4}
            fullWidth
            error={detailsError}
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
            error={quantityError}
          />
          <TextField
            onChange={(e) => setQuantifier(e.target.value)}
            label="quantifier"
            variant="outlined"
            color="secondary"
            required
            error={quantifierError}
          />
          <br></br>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={startValue}
              error={startError}
              onChange={(newValue) => {
                setStart(newValue.toLocaleDateString());
              }}
              renderInput={(params) => <TextField {...params} />}
            />

            <DatePicker
              label="End Date"
              value={endValue}
              error={endError}
              onChange={(newValue) => {
                setEnd(newValue.toLocaleDateString());
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <FormControl>
            <FormLabel>Time section</FormLabel>
            <RadioGroup
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
            endIcon={<KeyboardArrowRightIcon />}
          >
            Submit
          </Button>
        </form>
        {alert ? <Alert severity="error">{alert}</Alert> : <></>}
      </Container>
    </>
  );
}
