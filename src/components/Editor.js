import React, { Fragment, useEffect, useState } from 'react';
import SocketIO from 'socket.io-client';
import { useLocation } from 'react-router-dom';

let socket = null;

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

function App() {
  const [text, setText] = useState('');
  const query = useQuery();

  useEffect(() => {
    socket = SocketIO('http://localhost:8080');
    socket.emit('create-editor', query.get('editorId'));
  }, []);

  const onTextChange = (newText) => {
    socket.emit('text', newText);
  };

  useEffect(() => {
    socket.on('text', (data) => {
      console.log('received text');
      setText(data);
    });
  }, [text]);

  return (
    <Fragment>
      <div>Name:{query.get('name')}</div>
      <textarea
        onChange={(e) => onTextChange(e.target.value)}
        value={text}
      ></textarea>
      <DraftEditor />
    </Fragment>
  );
}

export default App;
