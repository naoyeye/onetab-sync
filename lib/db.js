"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.openOneTabDB = undefined;

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var levelup = require("levelup");
var leveldown = require("leveldown");
var sqlite3 = require("sqlite3").verbose();
var fs = require("fs");

var openOneTabDB = exports.openOneTabDB = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(config) {
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
                        return _context.abrupt("return", _context.sent);

                    case 14:
                        _context.prev = 14;
                        _context.t1 = _context["catch"](8);
                        return _context.abrupt("return", _promise2.default.reject(_context.t1));

                    case 17:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[0, 6], [8, 14]]);
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

                        _context2.prev = 2;
                        _context2.next = 5;
                        return levelup(leveldown(path), { createIfMissing: false });

                    case 5:
                        db = _context2.sent;
                        return _context2.abrupt("return", new _promise2.default(function (resolve, reject) {
                            var resolved = false;
                            db.createKeyStream().on("data", function (data) {
                                var key = data.toString();
                                if (key.startsWith("_chrome-extension://" + config.onetab_ext_id) && key.endsWith("state")) {
                                    resolve(createLevelDBInterface(db, key));
                                    resolved = true;
                                }
                            }).on("end", function () {
                                if (!resolved) {
                                    reject(new Error("one tab data is not found."));
                                }
                            });
                        }));

                    case 9:
                        _context2.prev = 9;
                        _context2.t0 = _context2["catch"](2);
                        return _context2.abrupt("return", _promise2.default.reject("can't open chrome localstorage db. If browser is running, please quit." + _context2.t0.message));

                    case 12:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, undefined, [[2, 9]]);
    }));

    return function openLevelDb(_x2, _x3) {
        return _ref2.apply(this, arguments);
    };
}();

var createLevelDBInterface = function createLevelDBInterface(db, key) {
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
                                return db.get(key);

                            case 3:
                                value = _context3.sent;
                                return _context3.abrupt("return", value.slice(1).toString('ucs2'));

                            case 7:
                                _context3.prev = 7;
                                _context3.t0 = _context3["catch"](0);
                                return _context3.abrupt("return", _promise2.default.reject(_context3.t0));

                            case 10:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, undefined, [[0, 7]]);
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
                                buf = Buffer.concat([Buffer.from([0x00]), new Buffer(value, "ucs2")]);
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
                                return _context5.abrupt("return", db.close());

                            case 1:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, undefined);
            }));

            function close() {
                return _ref5.apply(this, arguments);
            }

            return close;
        }()
    };
};

var openSqliteDb = function openSqliteDb(config, pathForTest) {
    var path = void 0;
    if (!pathForTest) {
        path = config.chrome_profile_path + "/Local Storage/chrome-extension_" + config.onetab_ext_id + "_0.localstorage";
    } else {
        path = pathForTest;
    }

    return new _promise2.default(function (resolve, reject) {
        try {
            fs.accessSync(path);
        } catch (e) {
            reject(e);
            return;
        }

        var db = new sqlite3.Database(path);
        db.serialize(function () {
            db.get("SELECT key,value FROM ItemTable WHERE key = ?", "state", function (err, row) {
                if (err) {
                    reject(err);
                } else {
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
                        resolve(row.value.toString("ucs2"));
                    }
                });
            });
        },
        put: function put(value) {
            return new _promise2.default(function (resolve, reject) {
                db.run("UPDATE ItemTable SET value = ? WHERE key = ?", new Buffer(value, "ucs2"), key, function (err, res) {
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