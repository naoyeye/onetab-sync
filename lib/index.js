"use strict";

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _gist = require("./gist");

var _gist2 = _interopRequireDefault(_gist);

var _db = require("./db");

var _db2 = _interopRequireDefault(_db);

var _conf = require("./conf");

var _conf2 = _interopRequireDefault(_conf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require("fs");

var program = require("commander");

var uploadToGist = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var config, oneTabData;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        console.info("uploading data to gist ...");
                        _context.prev = 1;
                        _context.next = 4;
                        return _conf2.default.load(["chrome_profile_path", "onetab_ext_id", "gist_token"]);

                    case 4:
                        config = _context.sent;

                        console.log('config - ', config);

                        _context.next = 8;
                        return readOneTabData(config);

                    case 8:
                        oneTabData = _context.sent;

                        console.log('oneTabData - ', typeof oneTabData === "undefined" ? "undefined" : (0, _typeof3.default)(oneTabData));

                        fs.writeFile('/Users/hanjiyun/Downloads/test.json', oneTabData, function (err, data) {
                            if (err) {
                                return console.log(err);
                            }
                            return '保存好了';
                        });

                        // Upload to gist
                        // let res = await gist.upload(config, oneTabData);
                        // console.info("success. " + res.html_url);
                        // return res;
                        _context.next = 16;
                        break;

                    case 13:
                        _context.prev = 13;
                        _context.t0 = _context["catch"](1);

                        console.error(_context.t0);

                    case 16:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[1, 13]]);
    }));

    return function uploadToGist() {
        return _ref.apply(this, arguments);
    };
}();

var downloadFromGist = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        var config, _ref3, _ref4, data, metadata, oneTabData, res;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        console.info("downloading data from gist ...");
                        _context2.prev = 1;
                        _context2.next = 4;
                        return _conf2.default.load(["chrome_profile_path", "onetab_ext_id", "gist_token", "gist_id"]);

                    case 4:
                        config = _context2.sent;
                        _context2.next = 7;
                        return _gist2.default.download(config);

                    case 7:
                        _ref3 = _context2.sent;
                        _ref4 = (0, _slicedToArray3.default)(_ref3, 2);
                        data = _ref4[0];
                        metadata = _ref4[1];
                        _context2.next = 13;
                        return readOneTabData(config);

                    case 13:
                        oneTabData = _context2.sent;
                        _context2.next = 16;
                        return _gist2.default.backup(config, oneTabData);

                    case 16:
                        res = _context2.sent;
                        _context2.next = 19;
                        return restoreOneTabData(config, data);

                    case 19:
                        console.info("success.");
                        return _context2.abrupt("return", res);

                    case 23:
                        _context2.prev = 23;
                        _context2.t0 = _context2["catch"](1);

                        console.error(_context2.t0);

                    case 26:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, undefined, [[1, 23]]);
    }));

    return function downloadFromGist() {
        return _ref2.apply(this, arguments);
    };
}();

var syncWithGist = function () {
    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
        var config;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.prev = 0;
                        _context3.next = 3;
                        return _conf2.default.load(["chrome_profile_path", "onetab_ext_id", "gist_token"]);

                    case 3:
                        config = _context3.sent;
                        _context3.next = 6;
                        return detectDownloadOrUpload(config);

                    case 6:
                        return _context3.abrupt("return", _context3.sent);

                    case 9:
                        _context3.prev = 9;
                        _context3.t0 = _context3["catch"](0);

                        console.error(_context3.t0);

                    case 12:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, undefined, [[0, 9]]);
    }));

    return function syncWithGist() {
        return _ref5.apply(this, arguments);
    };
}();

var restoreFromFile = function () {
    var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(file) {
        var config, content, res;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.prev = 0;
                        _context4.next = 3;
                        return _conf2.default.load(["chrome_profile_path", "onetab_ext_id"]);

                    case 3:
                        config = _context4.sent;
                        content = fs.readFileSync(file).toString();
                        _context4.next = 7;
                        return restoreOneTabData(config, content);

                    case 7:
                        res = _context4.sent;

                        console.info("success.");
                        return _context4.abrupt("return", res);

                    case 12:
                        _context4.prev = 12;
                        _context4.t0 = _context4["catch"](0);

                        console.error(_context4.t0);

                    case 15:
                    case "end":
                        return _context4.stop();
                }
            }
        }, _callee4, undefined, [[0, 12]]);
    }));

    return function restoreFromFile(_x) {
        return _ref6.apply(this, arguments);
    };
}();

var readOneTabData = function () {
    var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(config) {
        var db, result;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        _context5.prev = 0;
                        _context5.next = 3;
                        return (0, _db2.default)(config);

                    case 3:
                        db = _context5.sent;
                        _context5.next = 6;
                        return db.get();

                    case 6:
                        result = _context5.sent;

                        console.log('拿到了 readOneTabData result');
                        _context5.next = 10;
                        return db.close();

                    case 10:
                        console.log('真的关了', result.length);
                        return _context5.abrupt("return", result);

                    case 14:
                        _context5.prev = 14;
                        _context5.t0 = _context5["catch"](0);
                        return _context5.abrupt("return", _promise2.default.reject(new Error("can't open chrome localstorage db. If your browser is running, please quit it." + _context5.t0.message)));

                    case 17:
                    case "end":
                        return _context5.stop();
                }
            }
        }, _callee5, undefined, [[0, 14]]);
    }));

    return function readOneTabData(_x2) {
        return _ref7.apply(this, arguments);
    };
}();

var restoreOneTabData = function () {
    var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(config, data) {
        var db, result;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        _context6.prev = 0;
                        _context6.next = 3;
                        return (0, _db2.default)(config);

                    case 3:
                        db = _context6.sent;
                        _context6.next = 6;
                        return db.put(data);

                    case 6:
                        result = _context6.sent;
                        _context6.next = 9;
                        return db.close();

                    case 9:
                        return _context6.abrupt("return", result);

                    case 12:
                        _context6.prev = 12;
                        _context6.t0 = _context6["catch"](0);
                        return _context6.abrupt("return", _promise2.default.reject(new Error("can't open chrome localstorage db. If your browser is running, please quit it." + _context6.t0.message)));

                    case 15:
                    case "end":
                        return _context6.stop();
                }
            }
        }, _callee6, undefined, [[0, 12]]);
    }));

    return function restoreOneTabData(_x3, _x4) {
        return _ref8.apply(this, arguments);
    };
}();

var detectDownloadOrUpload = function detectDownloadOrUpload(config) {
    _gist2.default.download(config).then(function (_ref9) {
        var _ref10 = (0, _slicedToArray3.default)(_ref9, 2),
            data = _ref10[0],
            metadata = _ref10[1];

        if (config.lastsync === metadata.lastsync) {
            return uploadToGist();
        } else {
            return downloadFromGist();
        }
    }).catch(function (res) {
        return res.message === "Not Found" ? uploadToGist() : console.error(res);
    });
};

var pkginfo = JSON.parse(fs.readFileSync(__dirname + "/../package.json"));
program.version(pkginfo.version).description(pkginfo.description);

program.command("upload").description("force upload onetab data to gist").action(uploadToGist);

program.command("download").description("force download onetab data from gist").action(downloadFromGist);

program.command("sync").description("sync onetab data with gist").action(syncWithGist);

program.command("restore <file>").description("restore onetab data from backup file").action(restoreFromFile);

program.command("*", undefined, { noHelp: true }).action(function () {
    return program.help();
});

program.parse(process.argv);
if (!program.args.length) program.help();
//# sourceMappingURL=index.js.map