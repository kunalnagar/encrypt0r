/* eslint-disable @typescript-eslint/ban-ts-comment */
import $ from 'jquery';

import { EVENT_ENCRYPT, EVENT_LOG } from '../constants';

$(function () {
  let filePath = '';

  const $window = $(window);
  const $areaChoices = $('#area_choices');
  const $areaDrag = $('#area_drag');
  const $filePath = $('#file_path');
  const $fieldNotice = $('.notice');
  const $btnChoice = $('.btn--choice');
  const $btnReset = $('#choice_reset');
  const $btnEncrypt = $('#btn_encrypt');
  const $btnDecrypt = $('#btn_decrypt');
  const $fieldPassphrase = $('#passphrase');

  $btnChoice.on('click', function () {
    const $that = $(this);
    $areaChoices.hide();
    $areaDrag.show();
    $btnReset.show();
    $fieldPassphrase.show();
    if ($that.attr('id') === 'choice_encrypt') {
      $window.trigger(EVENT_LOG, {
        message: 'choice_encrypt',
      });
      $btnEncrypt.show();
      $btnDecrypt.hide();
    } else {
      $window.trigger(EVENT_LOG, {
        message: 'choice_decrypt',
      });
      $btnEncrypt.hide();
      $btnDecrypt.show();
    }
  });

  $btnReset.on('click', function () {
    $areaChoices.show();
    $areaDrag.hide();
    $btnReset.hide();
    $btnEncrypt.hide();
    $btnDecrypt.hide();
    $fieldNotice.empty();
    $filePath.empty();
    $fieldPassphrase.val('').hide();
    filePath = '';
    $window.trigger(EVENT_LOG, {
      message: 'choice_reset',
    });
  });

  $areaDrag.on('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    $fieldNotice.empty();
    // @ts-ignore
    const file = e.originalEvent.dataTransfer.files[0];
    filePath = file.path;
    $filePath.html(file.path);
    $window.trigger(EVENT_LOG, {
      message: 'drag_drop',
      filePath: file.path,
    });
    return false;
  });

  $btnEncrypt.on('click', function () {
    const passphrase = $fieldPassphrase.val();
    if (passphrase) {
      $window.trigger(EVENT_ENCRYPT, {
        filePath,
        passphrase,
      });
      // ipcRenderer.send('event:log', {
      //   action: 'click',
      //   element: 'choice_encrypt',
      // });
      // ipcRenderer.send('action:encrypt_decrypt', {
      //   action: 'encrypt',
      //   filePath,
      //   passphrase: $fieldPassphrase.val(),
      // });
    } else {
      $fieldNotice.html('Passphrase is required');
    }
  });

  $btnDecrypt.on('click', function () {
    if ($fieldPassphrase.val()) {
      // ipcRenderer.send('event:log', {
      //   action: 'click',
      //   element: 'choice_decrypt',
      // });
      // ipcRenderer.send('action:encrypt_decrypt', {
      //   action: 'decrypt',
      //   filePath,
      //   passphrase: $fieldPassphrase.val(),
      // });
    } else {
      $fieldNotice.html('Passphrase is required');
    }
  });

  $areaDrag.on('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  // ipcRenderer.on('notice-status', (e, notice) => {
  //   $fieldNotice.html(notice);
  // });
});
