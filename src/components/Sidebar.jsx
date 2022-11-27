import React from "react"
import {Typography } from "@mui/material"
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';

import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Link, useNavigate } from "react-router-dom";

const drawerWidth = 160
const drawerPaper = 160

export default function Sidebar() {
    let navigate = useNavigate();

    return(
        <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
        classes={{paper: drawerPaper}}
      >
        
        <Typography variant="h5" sx={{marginY:"50px",marginX:"auto"}}>TaskPlanner</Typography>
        
        <List >
          {["Tasks", "CreateTask"].map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={() => navigate("/"+text.toLowerCase())}>
                <ListItemText sx={{"margin":"auto","marginLeft":"10px"}} primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        
      </Drawer>
    )
}

