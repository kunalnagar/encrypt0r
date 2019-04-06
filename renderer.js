// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const ipcRenderer = require('electron').ipcRenderer;

$(function () {

    var filePath = '';

    var $areaChoices = $('#area_choices');
    var $areaDrag = $('#area_drag');
    var $filePath = $('#file_path');
    var $fieldNotice = $('.notice');
    var $btnChoice = $('.btn--choice');
    var $btnReset = $('#choice_reset');
    var $btnEncrypt = $('#btn_encrypt');
    var $btnDecrypt = $('#btn_decrypt');
    var $fieldPassphrase = $('#passphrase');

    $btnChoice.on('click', function() {
        var $that = $(this);
        $areaChoices.hide();
        $areaDrag.show();
        $btnReset.show();
        $fieldPassphrase.show();
        if($that.attr('id') === 'choice_encrypt') {
            $btnEncrypt.show();
            $btnDecrypt.hide();
        } else {
            $btnEncrypt.hide();
            $btnDecrypt.show();
        }
    });

    $btnReset.on('click', function() {
        $areaChoices.show();
        $areaDrag.hide();
        $btnReset.hide();
        $btnEncrypt.hide();
        $btnDecrypt.hide();
        $fieldNotice.empty();
        $filePath.empty();
        $fieldPassphrase.val('').hide();
        filePath = '';
        ipcRenderer.send('action:reset');
    });

    $areaDrag.on('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $fieldNotice.empty();
        var originalEvent = e.originalEvent;
        var file = originalEvent.dataTransfer.files[0];
        console.log(file);
        filePath = file.path;
        $filePath.html(file.path);
        return false;
    });

    // TODO
    $btnEncrypt.on('click', function() {
        ipcRenderer.send('action:encrypt_decrypt', {
            action: 'encrypt',
            filePath: filePath,
            passphrase: $fieldPassphrase.val()
        });
    });

    $btnDecrypt.on('click', function() {
        ipcRenderer.send('action:encrypt_decrypt', {
            action: 'decrypt',
            filePath: filePath,
            passphrase: $fieldPassphrase.val()
        });
    });

    $areaDrag.on('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
    });

    ipcRenderer.on('notice-status', function (e, notice) {
        console.warn(notice);
        $fieldNotice.html(notice);
    });

});
