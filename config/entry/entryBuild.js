const fs = require("fs");
const path = require("path");
const entry = require('./entry');
const nodeCommon = require('../common/nodeCommon');

const entryBuildPath = path.resolve(__dirname, '../../entry');
nodeCommon.deleteFile(entryBuildPath);
fs.mkdirSync(entryBuildPath);

const entryContent = (data) => {
    let cont = `<Index />`;
    return `
import React from 'react';
import ReactDOM from 'react-dom';
import Index from '../app/component/${data.path}';
ReactDOM.render(${cont},document.getElementById('app'));
    `
};
/*生成webpack entry 入口文件*/
entry.map((data) => {
    fs.writeFile(entryBuildPath + '/' + data.name + '.js', entryContent(data), 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
    });
});