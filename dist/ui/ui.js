"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/ban-ts-comment */
var jquery_1 = __importDefault(require("jquery"));
var constants_1 = require("../constants");
jquery_1.default(function () {
    var filePath = '';
    var $window = jquery_1.default(window);
    var $areaChoices = jquery_1.default('#area_choices');
    var $areaDrag = jquery_1.default('#area_drag');
    var $filePath = jquery_1.default('#file_path');
    var $fieldNotice = jquery_1.default('.notice');
    var $btnChoice = jquery_1.default('.btn--choice');
    var $btnReset = jquery_1.default('#choice_reset');
    var $btnEncrypt = jquery_1.default('#btn_encrypt');
    var $btnDecrypt = jquery_1.default('#btn_decrypt');
    var $fieldPassphrase = jquery_1.default('#passphrase');
    $btnChoice.on('click', function () {
        var $that = jquery_1.default(this);
        $areaChoices.hide();
        $areaDrag.show();
        $btnReset.show();
        $fieldPassphrase.show();
        if ($that.attr('id') === 'choice_encrypt') {
            $window.trigger(constants_1.EVENT_LOG, {
                message: 'choice_encrypt',
            });
            $btnEncrypt.show();
            $btnDecrypt.hide();
        }
        else {
            $window.trigger(constants_1.EVENT_LOG, {
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
        $window.trigger(constants_1.EVENT_LOG, {
            message: 'choice_reset',
        });
    });
    $areaDrag.on('drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $fieldNotice.empty();
        // @ts-ignore
        var file = e.originalEvent.dataTransfer.files[0];
        filePath = file.path;
        $filePath.html(file.path);
        $window.trigger(constants_1.EVENT_LOG, {
            message: 'drag_drop',
            filePath: filePath,
        });
        return false;
    });
    $btnEncrypt.on('click', function () {
        var passphrase = $fieldPassphrase.val();
        if (passphrase) {
            $window.trigger(constants_1.EVENT_ENCRYPT, {
                filePath: filePath,
                passphrase: passphrase,
            });
        }
        else {
            $fieldNotice.html('Passphrase is required');
        }
    });
    $btnDecrypt.on('click', function () {
        var passphrase = $fieldPassphrase.val();
        if (passphrase) {
            $window.trigger(constants_1.EVENT_DECRYPT, {
                filePath: filePath,
                passphrase: passphrase,
            });
        }
        else {
            $fieldNotice.html('Passphrase is required');
        }
    });
    $areaDrag.on('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
    });
    $window.on(constants_1.EVENT_NOTICE, function (e, data) {
        $fieldNotice.html(data);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidWkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdWkvdWkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxzREFBc0Q7QUFDdEQsa0RBQXVCO0FBRXZCLDBDQUtzQjtBQUV0QixnQkFBQyxDQUFDO0lBQ0EsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBRWxCLElBQU0sT0FBTyxHQUFHLGdCQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDMUIsSUFBTSxZQUFZLEdBQUcsZ0JBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUN4QyxJQUFNLFNBQVMsR0FBRyxnQkFBQyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ2xDLElBQU0sU0FBUyxHQUFHLGdCQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDbEMsSUFBTSxZQUFZLEdBQUcsZ0JBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNsQyxJQUFNLFVBQVUsR0FBRyxnQkFBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3JDLElBQU0sU0FBUyxHQUFHLGdCQUFDLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDckMsSUFBTSxXQUFXLEdBQUcsZ0JBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUN0QyxJQUFNLFdBQVcsR0FBRyxnQkFBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3RDLElBQU0sZ0JBQWdCLEdBQUcsZ0JBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUUxQyxVQUFVLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRTtRQUNyQixJQUFNLEtBQUssR0FBRyxnQkFBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RCLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNwQixTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDakIsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2pCLGdCQUFnQixDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3hCLElBQUksS0FBSyxDQUFDLElBQUksQ0FB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