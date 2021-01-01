const { ipcRenderer } = require('electron');

$(function () {
  let filePath = '';

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
      ipcRenderer.send('event:log', {
        action: 'click',
        element: 'choice_encrypt',
      });
      $btnEncrypt.show();
      $btnDecrypt.hide();
    } else {
      ipcRenderer.send('event:log', {
        action: 'click',
        element: 'choice_decrypt',
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
    ipcRenderer.send('event:log', {
      action: 'click',
      element: 'choice_reset',
    });
  });

  $areaDrag.on('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    $fieldNotice.empty();
    const { originalEvent } = e;
    const file = originalEvent.dataTransfer.files[0];
    filePath = file.path;
    $filePath.html(file.path);
    ipcRenderer.send('event:log', {
      action: 'drag_drop',
      filePath: file.path,
    });
    return false;
  });

  $btnEncrypt.on('click', function () {
    if ($fieldPassphrase.val()) {
      ipcRenderer.send('event:log', {
        action: 'click',
        element: 'choice_encrypt',
      });
      ipcRenderer.send('action:encrypt_decrypt', {
        action: 'encrypt',
        filePath,
        passphrase: $fieldPassphrase.val(),
      });
    } else {
      $fieldNotice.html('Passphrase is required');
    }
  });

  $btnDecrypt.on('click', function () {
    if ($fieldPassphrase.val()) {
      ipcRenderer.send('event:log', {
        action: 'click',
        element: 'choice_decrypt',
      });
      ipcRenderer.send('action:encrypt_decrypt', {
        action: 'decrypt',
        filePath,
        passphrase: $fieldPassphrase.val(),
      });
    } else {
      $fieldNotice.html('Passphrase is required');
    }
  });

  $areaDrag.on('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  ipcRenderer.on('notice-status', (e, notice) => {
    $fieldNotice.html(notice);
  });
});
