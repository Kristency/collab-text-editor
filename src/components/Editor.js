import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import { Box, Chip, Tooltip, Typography } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';

let socket = null;

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

function App() {
  const [text, setText] = useState('');
  const query = useQuery();

  useEffect(() => {
    socket = io('https://collab-editor-api.herokuapp.com', {
      transports: ['websocket']
    });
    socket.emit('join-editor', query.get('editorId'));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onTextChange = (newText) => {
    setText(newText);
    socket.emit('send-text', newText);
  };

  useEffect(() => {
    socket.on('receive-text', (data) => {
      setText(data);
    });
  }, [text]);

  return (
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
    </Box>
  );
}

export default App;
