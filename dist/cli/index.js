#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var yargs_1 = __importDefault(require("yargs"));
var Crypto_1 = __importDefault(require("../business-logic/Crypto"));
var options = yargs_1.default
    .option('m', {
    alias: 'mode',
    describe: 'Mode',
    choices: ['encrypt', 'decrypt'],
    demandOption: true,
})
    .option('i', {
    alias: 'input',
    describe: 'Input file',
    demandOption: true,
})
    .option('o', {
    alias: 'output',
    describe: 'Output folder',
})
    .option('p', {
    alias: 'passphrase',
    describe: 'Passphrase',
    demandOption: true,
}).parseSync();
var oMode = "" + options.m;
var oInput = "" + options.i;
var oOutput = options.o;
var oPassphrase = "" + options.p;
if (!fs_1.existsSync(oInput)) {
    console.error('ERROR: Input file does not exist');
    process.exit();
}
else if (!fs_1.lstatSync(oInput).isFile()) {
    console.error('ERROR: Input is not a file');
    process.exit();
}
if (oOutput && !fs_1.existsSync(oOutput)) {
    console.error('ERROR: Output directory does not exist');
    process.exit();
}
else if (!fs_1.lstatSync(oOutput).isDirectory()) {
    console.error('ERROR: Output is not a directory');
    process.exit();
}
var sourceArray = oInput.split('/');
var filename = sourceArray[sourceArray.length - 1];
var outputFile = '';
if (oOutput) {
    if (oMode === 'encrypt') {
        outputFile = oOutput + "/" + filename + ".enc";
    }
    else if (oMode === 'decrypt') {
        outputFile = oOutput + "/" + filename.replace('.enc', '');
    }
}
else {
    if (oMode === 'encrypt') {
        outputFile = oInput + ".enc";
    }
    else if (oMode === 'decrypt') {
        outputFile = "" + oInput.replace('.enc', '');
    }
}
var crypto = new Crypto_1.default(oInput, outputFile, oPassphrase);
if (oMode === 'encrypt') {
    crypto.encrypt();
}
else if (oMode === 'decrypt') {
    crypto.decrypt();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2xpL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLHlCQUEyQztBQUMzQyxnREFBMEI7QUFFMUIsb0VBQThDO0FBRTlDLElBQU0sT0FBTyxHQUFHLGVBQUs7S0FDbEIsTUFBTSxDQUFDLEdBQUcsRUFBRTtJQUNYLEtBQUssRUFBRSxNQUFNO0lBQ2IsUUFBUSxFQUFFLE1BQU07SUFDaEIsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQztJQUMvQixZQUFZLEVBQUUsSUFBSTtDQUNuQixDQUFDO0tBQ0QsTUFBTSxDQUFDLEdBQUcsRUFBRTtJQUNYLEtBQUssRUFBRSxPQUFPO0lBQ2QsUUFBUSxFQUFFLFlBQVk7SUFDdEIsWUFBWSxFQUFFLElBQUk7Q0FDbkIsQ0FBQztLQUNELE1BQU0sQ0FBQyxHQUFHLEVBQUU7SUFDWCxLQUFLLEVBQUUsUUFBUTtJQUNmLFFBQVEsRUFBRSxlQUFlO0NBQzFCLENBQUM7S0FDRCxNQUFNLENBQUMsR0FBRyxFQUFFO0lBQ1gsS0FBSyxFQUFFLFlBQVk7SUFDbkIsUUFBUSxFQUFFLFlBQVk7SUFDdEIsWUFBWSxFQUFFLElBQUk7Q0FDbkIsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBRWpCLElBQU0sS0FBSyxHQUFHLEtBQUcsT0FBTyxDQUFDLENBQUcsQ0FBQztBQUM3QixJQUFNLE1BQU0sR0FBRyxLQUFHLE9BQU8sQ0FBQyxDQUFHLENBQUM7QUFDOUIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUMxQixJQUFNLFdBQVcsR0FBRyxLQUFHLE9BQU8sQ0FBQyxDQUFHLENBQUM7QUFFbkMsSUFBSSxDQUFDLGVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRTtJQUN2QixPQUFPLENBQUMsS0FBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7SUFDbEQsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0NBQ2hCO0tBQU0sSUFBSSxDQUFDLGNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtJQUN0QyxPQUFPLENBQUMsS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUM7SUFDNUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0NBQ2hCO0FBRUQsSUFBSSxPQUFPLElBQUksQ0FBQyxlQUFVLENBQUMsT0FBaUIsQ0FBQyxFQUFFO0lBQzdDLE9BQU8sQ0FBQyxLQUFLLENBQUMsd0NBQXdDLENBQUMsQ0FBQztJQUN4RCxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7Q0FDaEI7S0FBTSxJQUFJLENBQUMsY0FBUyxDQUFDLE9BQWlCLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRTtJQUN0RCxPQUFPLENBQUMsS0FBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7SUFDbEQsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0NBQ2hCO0FBRUQsSUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN0QyxJQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztBQUVyRCxJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFDcEIsSUFBSSxPQUFPLEVBQUU7SUFDWCxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7UUFDdkIsVUFBVSxHQUFNLE9BQU8sU0FBSSxRQUFRLFNBQU0sQ0FBQztLQUMzQztTQUFNLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtRQUM5QixVQUFVLEdBQU0sT0FBTyxTQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBRyxDQUFDO0tBQzNEO0NBQ0Y7S0FBTTtJQUNMLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtRQUN2QixVQUFVLEdBQU0sTUFBTSxTQUFNLENBQUM7S0FDOUI7U0FBTSxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7UUFDOUIsVUFBVSxHQUFHLEtBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFHLENBQUM7S0FDOUM7Q0FDRjtBQUVELElBQU0sTUFBTSxHQUFHLElBQUksZ0JBQU0sQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBRTNELElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtJQUN2QixNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7Q0FDbEI7S0FBTSxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7SUFDOUIsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO0NBQ2xCIn0=