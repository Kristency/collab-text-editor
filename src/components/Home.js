import React, { useState } from 'react';
import {
  Button,
  Box,
  Grid,
  TextField,
  Dialog,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';

function Home() {
  const [name, setName] = useState('');
  const [editorId, setEditorId] = useState('');
  const [open, setOpen] = useState(false);
  const [isNewEditor, setIsNewEditor] = useState(false);
  const history = useHistory();

  const onSubmitClick = () => {
    if (isNewEditor) {
      if (name) {
        history.push('/editor');
      }
    } else {
      if (name && editorId) {
        history.push(`/editor?name=${name}&editorId=${editorId}`);
      }
    }
  };

  const handleOnClose = () => {
    setIsNewEditor(false);
    setOpen(false);
  };

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      style={{ height: '100vh' }}
    >
      <Grid item md={2}>
        <Box mb={3}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            onClick={() => setOpen(true)}
          >
            Join
          </Button>
        </Box>
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={() => {
            setIsNewEditor(true);
            setOpen(true);
          }}
        >
          New
        </Button>
        <Dialog
          onClose={handleOnClose}
          aria-labelledby="simple-dialog-title"
          open={open}
        >
          <DialogContent>
            <DialogContentText>
              {`Enter your name ${
                !isNewEditor
                  ? `and the editor id to join.`
                  : `to create a new editor.`
              }`}
            </DialogContentText>
            <TextField
              autoFocus
              fullWidth
              autoComplete="off"
              id="name"
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {!isNewEditor && (
              <Box mt={4}>
                <TextField
                  fullWidth
                  autoComplete="off"
                  id="editorid"
                  label="Editor Id"
                  variant="outlined"
                  value={editorId}
                  onChange={(e) => setEditorId(e.target.value)}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={handleOnClose}>
              Cancel
            </Button>
            <Button color="primary" onClick={onSubmitClick}>
              {isNewEditor ? `Create` : `Join`}
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Grid>
  );
}

export default Home;
