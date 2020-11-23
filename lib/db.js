"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.openOneTabDB = undefined;

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var levelup = require("levelup");
var leveldown = require("leveldown");
var level = require('level');
var sqlite3 = require("sqlite3").verbose();
var fs = require("fs");
var encoding = require('encoding');
var encode = require('encoding-down');

var openOneTabDB = exports.openOneTabDB = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(config) {
        var ldb;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return openSqliteDb(config);

                    case 3:
                        return _context.abrupt("return", _context.sent);

                    case 6:
                        _context.prev = 6;
                        _context.t0 = _context["catch"](0);
                        _context.prev = 8;
                        _context.next = 11;
                        return openLevelDb(config);

                    case 11:
                        ldb = _context.sent;

                        console.log('ldb = ', ldb);
                        return _context.abrupt("return", ldb);

                    case 16:
                        _context.prev = 16;
                        _context.t1 = _context["catch"](8);

                        console.log('出错了 e = ', _context.t1);
                        return _context.abrupt("return", _promise2.default.reject(_context.t1));

                    case 20:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[0, 6], [8, 16]]);
    }));

    return function openOneTabDB(_x) {
        return _ref.apply(this, arguments);
    };
}();

var openLevelDb = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(config, pathForTest) {
        var path, db;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        path = void 0;

                        if (!pathForTest) {
                            path = config.chrome_profile_path + "/Local Storage/leveldb";
                        } else {
                            path = pathForTest;
                        }

                        console.log('openLevelDb - 1');

                        _context2.prev = 3;
                        _context2.next = 6;
                        return levelup(encode(leveldown(path)), {
                            createIfMissing: false
                            // valueEncoding: 'json'
                        });

                    case 6:
                        db = _context2.sent;

                        // let db = await level(path)
                        console.log('openLevelDb - 2');
                        // return new Promise((resolve, reject) => {
                        //     let resolved = false;
                        //     let ks = db.createKeyStream()
                        //     ks.setEncoding('utf-8')
                        //     ks.on("data", (data) => {
                        //         let key = data.toString();
                        //         if (key && key.startsWith("_chrome-extension://" + config.onetab_ext_id) && key.endsWith("state")) {
                        //             console.log('openLevelDb - 5')
                        //             const obj = createLevelDBInterface(db, key)
                        //             console.log('obj - ', obj)
                        //             resolve(obj);
                        //             resolved = true;
                        //         }
                        //     })
                        //     ks.on("end", () => {
                        //         console.log('end!')
                        //         if (!resolved) {
                        //             reject(new Error("one tab data is not found."));
                        //         }
                        //     });
                        // })

                        return _context2.abrupt("return", new _promise2.default(function (resolve, reject) {
                            var resolved = false;
                            var ks = db.createReadStream();
                            ks.on('data', function (data) {
                                if (!data.key.startsWith("_chrome-extension://" + config.onetab_ext_id) && !data.key.startsWith('META:htt') && !data.key.startsWith("_chrome-devtools")) {
                                    console.log(data.key, ' = ', data.value.toString());
                                    console.log('-=================');
                                }
                                var key = data.key.toString();
                                if (key && key.startsWith("_chrome-extension://" + config.onetab_ext_id) && key.endsWith("state")) {
                                    var obj = createLevelDBInterface(db, key);
                                    resolve(obj);
                                    resolved = true;
                                }
                            }).on('end', function () {
                                console.log('Stream ended');
                                if (!resolved) {
                                    reject(new Error("one tab data is not found."));
                                }
                            });
                        }));

                    case 11:
                        _context2.prev = 11;
                        _context2.t0 = _context2["catch"](3);
                        return _context2.abrupt("return", _promise2.default.reject("can't open chrome localstorage db. If browser is running, please quit." + _context2.t0.message));

                    case 14:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, undefined, [[3, 11]]);
    }));

    return function openLevelDb(_x2, _x3) {
        return _ref2.apply(this, arguments);
    };
}();

function chkstrlen(str) {
    var strlen = 0;
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) //如果是汉字，则字符串长度加2
            strlen += 2;else strlen++;
    }
    return strlen;
}

var createLevelDBInterface = function createLevelDBInterface(db, key) {
    console.log('createLevelDBInterface - 1');
    return {
        get: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                var value;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.prev = 0;
                                _context3.next = 3;
                                return db.get(key, { valueEncoding: 'utf8' });

                            case 3:
                                value = _context3.sent;

                                // value = encoding.convert(value, 'utf8', 'utf8')//.toString();

                                // value = encoding.convert(value.slice(572, 622), 'UTF-8', 'UCS2')
                                // value = value.slice(572, 622)

                                console.log('typeof value - ', typeof value === "undefined" ? "undefined" : (0, _typeof3.default)(value));
                                // console.log('value - ', value)
                                // for (let s of value) {
                                // console.log(s)
                                // console.log(String.fromCodePoint(s))
                                // }

                                return _context3.abrupt("return", value);

                            case 8:
                                _context3.prev = 8;
                                _context3.t0 = _context3["catch"](0);
                                return _context3.abrupt("return", _promise2.default.reject(_context3.t0));

                            case 11:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, undefined, [[0, 8]]);
            }));

            function get() {
                return _ref3.apply(this, arguments);
            }

            return get;
        }(),
        put: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(value) {
                var buf;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.prev = 0;
                                buf = Buffer.concat([Buffer.from([0x00]), new Buffer.from(value, "UTF-8")]);
                                _context4.next = 4;
                                return db.put(key, buf);

                            case 4:
                                return _context4.abrupt("return", _context4.sent);

                            case 7:
                                _context4.prev = 7;
                                _context4.t0 = _context4["catch"](0);
                                return _context4.abrupt("return", _promise2.default.reject(_context4.t0));

                            case 10:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, undefined, [[0, 7]]);
            }));

            function put(_x4) {
                return _ref4.apply(this, arguments);
            }

            return put;
        }(),
        close: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.prev = 0;

                                console.log('关闭了！');
                                return _context5.abrupt("return", db.close());

                            case 5:
                                _context5.prev = 5;
                                _context5.t0 = _context5["catch"](0);
                                return _context5.abrupt("return", _promise2.default.reject(_context5.t0));

                            case 8:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, undefined, [[0, 5]]);
            }));

            function close() {
                return _ref5.apply(this, arguments);
            }

            return close;
        }()
    };
};

var openSqliteDb = function openSqliteDb(config, pathForTest) {
    console.log('=openSqliteDb 1 !!!');
    var path = void 0;
    if (!pathForTest) {
        path = config.chrome_profile_path + "/Local Storage/chrome-extension_" + config.onetab_ext_id + "_0.localstorage";
    } else {
        path = pathForTest;
    }

    return new _promise2.default(function (resolve, reject) {
        console.log('path - ', path);
        try {
            console.log('openSqliteDb 2!');
            fs.accessSync(path);
        } catch (e) {
            console.log('openSqliteDb 3!');
            reject(e);
            return;
        }

        var db = new sqlite3.Database(path);

        console.log('openSqliteDb 4!');

        db.serialize(function () {
            db.get("SELECT key,value FROM ItemTable WHERE key = ?", "state", function (err, row) {
                if (err) {
                    reject(err);
                } else {
                    console.log('createSqliteDBInterface!');
                    resolve(createSqliteDBInterface(db, row.key));
                }
            });
        });
    });
};

var createSqliteDBInterface = function createSqliteDBInterface(db, key) {
    return {
        get: function get() {
            return new _promise2.default(function (resolve, reject) {
                db.get("SELECT key,value FROM ItemTable WHERE key = '" + key + "'", function (err, row) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row.value.toString("UTF-8"));
                    }
                });
            });
        },
        put: function put(value) {
            return new _promise2.default(function (resolve, reject) {
                db.run("UPDATE ItemTable SET value = ? WHERE key = ?", new Buffer.from(value, "UTF-8"), key, function (err, res) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        },
        close: function close() {
            return new _promise2.default(function (resolve, reject) {
                db.close(function (err) {
                    if (err) reject(err);else resolve();
                });
            });
        }
    };
};

exports.default = openOneTabDB;
//# sourceMappingURL=db.js.map