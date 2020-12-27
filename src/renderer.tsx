// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.
import React from 'react';
import ReactDOM from 'react-dom';
import './css/app.css';
import App from '@/app/app';

ReactDOM.render(<App />, document.getElementById('root'));
