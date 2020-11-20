"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require("fs");
var os = require("os");

var inquirer = require("inquirer");

var CONFIG = os.homedir() + "/.onetab-sync.json";

console.log('CONFIG - ', CONFIG);

var QUESTIONS = {
    "chrome_profile_path": [{
        type: "list",
        name: "chrome_profile_path",
        message: "Select the path to user profile directory of Chrome ",
        choices: function choices() {
            var canditates = findProfiles();
            canditates.push("custom");
            return canditates;
        }
    }, {
        type: "input",
        name: "chrome_profile_path",
        when: function when(answer) {
            return answer && answer.chrome_profile_path === "custom";
        },
        message: "Please input",
        validate: function validate(value) {
            try {
                fs.accessSync(value);
                return true;
            } catch (e) {
                return false;
            }
        }
    }],
    "onetab_ext_id": [{
        type: "input",
        name: "onetab_ext_id",
        default: function _default(answer) {
            return answer.chrome_profile_path ? findOneTabExtensionID(answer.chrome_profile_path) : undefined;
        },
        message: "Input the extension ID of OneTab.",
        validate: function validate(value) {
            return !!value;
        }
    }],
    "gist_token": [{
        type: "input",
        name: "gist_token",
        message: "Input your gist access token.",
        validate: function validate(value) {
            return !!value;
        }
    }],
    "gist_id": [{
        type: "input",
        name: "gist_id",
        message: "Input the gist ID which OneTab data is stored.",
        validate: function validate(value) {
            return !!value;
        }
    }]
};

var loadConfig = function loadConfig(requests) {
    return new _promise2.default(function (resolve, reject) {
        var config = {};
        try {
            config = JSON.parse(fs.readFileSync(CONFIG));
        } catch (e) {
            if (e.code !== "ENOENT") {
                reject(e);
            }
        }

        var qs = [];
        requests.forEach(function (name) {
            if (!config[name]) {
                qs = qs.concat(QUESTIONS[name]);
            }
        });
        inquirer.prompt(qs).then(function (answers) {
            var result = (0, _assign2.default)(config, answers);
            if ((0, _keys2.default)(answers).length > 0) {
                saveConfig(result);
                console.info("configuration is saved in " + CONFIG);
            }
            resolve(result);
        });
    });
};

var PROFILE_DIRS = {
    "win32": [os.homedir() + "\\AppData\\Local\\Google\\Chrome\\User Data\\Default", os.homedir() + "\\AppData\\Local\\Google\\Chrome SxS\\User Data\\Default", os.homedir() + "\\AppData\\Local\\Chromium\\User Data\\Default", os.homedir() + "\\AppData\\Local\\Vivaldi\\User Data\\Default"],
    "linux": [os.homedir() + "/.config/google-chrome/Default", os.homedir() + "/.config/google-chrome-beta/Default", os.homedir() + "/.config/google-chrome-unstable/Default", os.homedir() + "/.config/chromium/Default", os.homedir() + "/.config/vivaldi/Default"],
    "darwin": [os.homedir() + "/Library/Application Support/Google/Chrome/Default", os.homedir() + "~/Library/Application Support/Google/Chrome Canary/Default", os.homedir() + "~/Library/Application Support/Chromium/Default", os.homedir() + "~/Library/Application Support/Vivaldi/Default"]
};
var findProfiles = function findProfiles() {
    var dirs = PROFILE_DIRS[os.platform()];
    var profiles = [];
    if (dirs) {
        dirs.forEach(function (dir) {
            try {
                if (fs.statSync(dir).isDirectory()) {
                    profiles.push(dir);
                }
            } catch (e) {/* skip */}
        });
    }
    return profiles;
};

var findOneTabExtensionID = function findOneTabExtensionID(profileDir) {
    var extsDir = profileDir + "/Extensions";
    var id = undefined;
    fs.readdirSync(extsDir).forEach(function (ext) {
        try {
            var extDir = extsDir + "/" + ext.toString();
            fs.readdirSync(extDir).forEach(function (version) {
                var versionDir = extDir + "/" + version.toString();
                try {
                    fs.readdirSync(versionDir).forEach(function (file) {
                        if (file.toString() === "onetab.html") {
                            id = ext.toString();
                        }
                    });
                } catch (e) {/* skip */}
            });
        } catch (e) {/* skip */}
    });
    return id;
};

var saveConfig = function saveConfig(value) {
    fs.writeFileSync(CONFIG, (0, _stringify2.default)(value));
};

exports.default = {
    load: loadConfig,
    save: saveConfig
};
//# sourceMappingURL=conf.js.map