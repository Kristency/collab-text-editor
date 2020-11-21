import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Grid,
  Paper,
  Chip,
  Tooltip,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Snackbar
} from '@material-ui/core';

import FolderIcon from '@material-ui/icons/Folder';
import FileCopyIcon from '@material-ui/icons/FileCopy';

let socket = null;

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const useStyles = makeStyles((theme) => ({
  // root: {
  //   flexGrow: 1
  // },
  paper: {
    maxWidth: 400,
    marginTop: '40px'
  }
}));

function App() {
  const [text, setText] = useState('');
  const [users, setUsers] = useState([]);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: ''
  });
  const query = useQuery();

  useEffect(() => {
    // socket = io('https://collab-editor-api.herokuapp.com', {
    socket = io('http://localhost:8080', {
      transports: ['websocket']
    });
    socket.emit('join-editor', {
      editorId: query.get('editorId'),
      username: query.get('name')
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onTextChange = (newText) => {
    setText(newText);
    socket.emit('editor-state', newText);
  };

  useEffect(() => {
    socket.on('editor-state', (data) => {
      setText(data);
    });
  }, [text]);

  useEffect(() => {
    socket.on('user-list', (userlist) => {
      setUsers(userlist);
    });

    socket.on('message', (msg) => {
      setSnackbarState({ open: true, message: msg });
    });
  }, [users, snackbarState]);

  const classes = useStyles();

  return (
    <>
      <Box mx={3} my={3}>
        <Typography display="inline">Editor Id : </Typography>
        <Chip
          label={query.get('editorId')}
          deleteIcon={
            <Tooltip title="Copy">
              <FileCopyIcon />
            </Tooltip>
          }
          onDelete={() => navigator.clipboard.writeText(query.get('editorId'))}
        />
        <Grid container spacing={2}>
          <Grid item xs={5}>
            <Paper className={classes.paper}>
              <List>
                {users.map((user) => (
                  <ListItem key={user.id}>
                    <ListItemAvatar>
                      <Avatar>
                        <FolderIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={user.username} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={7}>
            <div>
              <textarea
                rows="20"
                cols="100"
                id="editor"
                style={{
                  backgroundColor: 'dimgrey',
                  color: 'white',
                  fontSize: '15px',
                  marginTop: '40px'
                }}
                placeholder="Type Your Text..."
                onChange={(e) => onTextChange(e.target.value)}
                value={text}
              ></textarea>
            </div>
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbarState.open}
        autoHideDuration={3000}
        onClose={() => setSnackbarState({ open: false, message: '' })}
        message={snackbarState.message}
      />
    </>
  );
}

export default App;
