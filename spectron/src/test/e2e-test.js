const chaiAsPromised = require("chai-as-promised");
const chai = require("chai");

const path = require('path');
const Application = require('spectron').Application;

global.before(function () {
    chai.should();
    chai.use(chaiAsPromised);
});

let electronPath = path.join(__dirname, "../../node_modules", ".bin", "electron");

if (process.platform === 'win32') {
    electronPath += '.cmd';
}

var appPath = path.join(__dirname, '../../../dist/helloworld/helloworld-app.app');

var app = new Application({
            path: electronPath,
            args: [appPath]
        });

describe("test-helloworld-app", function () {

    // Start spectron
    before(function () {
        chaiAsPromised.transferPromiseness = app.transferPromiseness;
        return app.start();
    });

    // Stop Electron
    after(function () {
        if (app && app.isRunning()) {
            return app.stop();
        }
    });

    describe("Hello-World", function () {
        // wait for Electron window to open
        it('open window', function () {
            return app.client.waitUntilWindowLoaded().getWindowCount().should.eventually.equal(1);
        });
    });
});

