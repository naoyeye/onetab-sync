"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _conf = require("./conf");

var _conf2 = _interopRequireDefault(_conf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Gists = require("gists");

var DATA_FILE_NAME = "onetab-data.json";
var META_DATA_NAME = "metadata.json";
var BACKUP_DATAFILE_NAME = "onetab-data-backup.json";
var SYNC_DATE = Date.now();
var DATA_VERSION = 1;

var upload = function upload(config, content) {
    var _files;

    var gists = new Gists({ token: config.gist_token });
    var opts = {
        description: "created by onetab sync",
        public: false,
        files: (_files = {}, (0, _defineProperty3.default)(_files, DATA_FILE_NAME, { content: content }), (0, _defineProperty3.default)(_files, META_DATA_NAME, { content: (0, _stringify2.default)({ lastsync: SYNC_DATE, version: DATA_VERSION }) }), _files)
    };

    return new _promise2.default(function (resolve, reject) {
        var create = function create() {
            gists.post('/gists', opts, function (err, res) {
                if (err) {
                    reject(err);
                } else if (res.id) {
                    config.gist_id = res.id;
                    config.lastsync = SYNC_DATE;
                    _conf2.default.save(config);
                    resolve(res);
                }
            });
        };

        if (typeof config.gist_id !== "undefined" && config.gist_id != "") {
            opts.id = config.gist_id;
            gists.edit(opts, function (err, res) {
                if (err) {
                    reject(err);
                } else if (res.files) {
                    config.lastsync = SYNC_DATE;
                    _conf2.default.save(config);
                    resolve(res);
                } else {
                    create();
                }
            });
        } else {
            create();
        }
    });
};

var backup = function backup(config, content) {
    if (typeof config.gist_id === "undefined" || config.gist_id == "") {
        return _promise2.default.reject(new Error("failed to backup. gist id is not given."));
    }

    var gists = new Gists({ token: config.gist_token });
    var opts = {
        id: config.gist_id,
        files: (0, _defineProperty3.default)({}, BACKUP_DATAFILE_NAME, { content: content })
    };
    return new _promise2.default(function (resolve, reject) {
        gists.edit(opts, function (err, res) {
            if (res && res.files) {
                resolve(res);
            } else {
                reject(err || res);
            }
        });
    });
};

var download = function download(config) {
    var gists = new Gists({ token: config.gist_token });
    return new _promise2.default(function (resolve, reject) {
        gists.download({ id: config.gist_id }, function (err, res) {
            if (err) {
                reject(err);
            } else if (res.files && res.files[DATA_FILE_NAME]) {
                var content = res.files[DATA_FILE_NAME].content;
                var metadata = res.files[META_DATA_NAME].content || "{}";
                resolve([content, JSON.parse(metadata)]);
            } else {
                reject(res);
            }
        });
    });
};

exports.default = {
    upload: upload,
    download: download,
    backup: backup
};
//# sourceMappingURL=gist.js.map