'use strict';

const fs = require('fs');
const path = require('path');
const chai = require('chai');
const sinon = require('sinon');

chai.use(require('chai-as-promised'));

global.chai = chai;
global.expect = chai.expect;
global.sinon = sinon;

const EXCLUDE = ['main.js'];

function executeTestsRecursively (_path) {
    return fs.readdirSync(_path).forEach(_f => {
        if (_f.indexOf('.') === -1) {
            describe(_f.replace(/\d+-/, ''), () => {
                return executeTestsRecursively(path.join(_path, _f));
            });
        }

        if (_f.indexOf('.js') === -1 || EXCLUDE.indexOf(_f) !== -1) {
            return;
        }

        describe(_f.replace('.js', '').replace(/\d+-/, ''), () => {
            require(path.join(_path, _f));
        });
    });
}

executeTestsRecursively(__dirname);
