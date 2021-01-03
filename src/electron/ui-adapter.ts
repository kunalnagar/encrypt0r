/* eslint-disable @typescript-eslint/no-explicit-any */
import { ipcRenderer } from 'electron';
import $ from 'jquery';

import { EVENT_DECRYPT, EVENT_ENCRYPT, EVENT_LOG } from '../constants';

const $window = $(window);

const sendEventToElectron = (eventName: string, data?: any) =>
  ipcRenderer.send(eventName, data);

$window.on(EVENT_LOG, (e, data) => sendEventToElectron(EVENT_LOG, data));
$window.on(EVENT_ENCRYPT, (e, data) =>
  sendEventToElectron(EVENT_ENCRYPT, data),
);
$window.on(EVENT_DECRYPT, (e, data) =>
  sendEventToElectron(EVENT_DECRYPT, data),
);
