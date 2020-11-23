const levelup = require("levelup");
const leveldown = require("leveldown");
const level = require('level');
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const encoding = require('encoding');
const encode = require('encoding-down')

export const openOneTabDB = async (config) => {
    try {
        return await openSqliteDb(config);
    } catch (_) {
        try {
            const ldb = await openLevelDb(config);
            console.log('ldb = ', ldb)
            return ldb;
        } catch(e) {
            console.log('出错了 e = ', e)
            return Promise.reject(e);
        }
    }
}

const openLevelDb = async (config, pathForTest) => {
    let path;
    if (!pathForTest) {
        path = config.chrome_profile_path + "/Local Storage/leveldb";
    } else {
        path = pathForTest;
    }

    console.log('openLevelDb - 1')

    try {
        let db = await levelup(encode(leveldown(path)), {
            createIfMissing: false,
            // valueEncoding: 'json'
        });
        // let db = await level(path)
        console.log('openLevelDb - 2')
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

        return new Promise((resolve, reject) => {
            let resolved = false;
            let ks = db.createReadStream()
            ks.on('data', (data) => {
                if (!data.key.startsWith("_chrome-extension://" + config.onetab_ext_id) && !data.key.startsWith('META:htt') && !data.key.startsWith("_chrome-devtools")) {
                    console.log(data.key, ' = ', data.value.toString())
                    console.log('-=================')
                }
                let key = data.key.toString();
                if (key && key.startsWith("_chrome-extension://" + config.onetab_ext_id) && key.endsWith("state")) {
                    const obj = createLevelDBInterface(db, key);
                    resolve(obj);
                    resolved = true;
                }
            })
            .on('end', function () {
                console.log('Stream ended')
                if (!resolved) {
                    reject(new Error("one tab data is not found."));
                }
            })
        })
    } catch (err) {
        return Promise.reject("can't open chrome localstorage db. If browser is running, please quit." + err.message);
    }
};

function chkstrlen(str){
　　　　var strlen = 0;
　　　　for(var i = 0;i < str.length; i++){
　　　　　　if(str.charCodeAt(i) > 255) //如果是汉字，则字符串长度加2
　　　　　　　　strlen += 2;
　　　　　　else  
　　　　　　　　strlen++;
　　　　}
　　　　return   strlen;
}

const createLevelDBInterface = (db, key) => {
    console.log('createLevelDBInterface - 1')
    return {
        get: async () => {
            try {
                // let buf = Buffer.concat([Buffer.from([0x00]), new Buffer.from('好书影音报告 2021', "utf8")])
                // await db.put(key, buf);

                // let value = await db.get(key);
                // value = encoding.convert(value.slice(1), 'utf8', 'utf8').toString();
                // console.log(typeof value)
                // // const dataStr = encoding.convert(value.slice(1), 'GBK', 'UCS-2').toString();

                // const dataStr = '好书影音报告 2020'.toString('utf8') // value.slice(1).toString('utf8')

                let value = await db.get(key, { valueEncoding: 'utf8' });
                // value = encoding.convert(value, 'utf8', 'utf8')//.toString();

                // value = encoding.convert(value.slice(572, 622), 'UTF-8', 'UCS2')
                // value = value.slice(572, 622)

                console.log('typeof value - ', typeof value)
                // console.log('value - ', value)
                // for (let s of value) {
                    // console.log(s)
                    // console.log(String.fromCodePoint(s))
                // }

                return value
            } catch (e) {
                return Promise.reject(e);
            }
        },
        put: async (value) => {
            try {
                let buf = Buffer.concat([Buffer.from([0x00]), new Buffer.from(value, "UTF-8")]);
                return await db.put(key, buf);
            } catch (e) {
                return Promise.reject(e);
            }
        },
        close: async () => {
            try {
                console.log('关闭了！')
                return db.close();
            } catch (e) {
                return Promise.reject(e);
            }
        }
    }
};

const openSqliteDb = (config, pathForTest) => {
    console.log('=openSqliteDb 1 !!!')
    let path;
    if (!pathForTest) {
        path = config.chrome_profile_path + "/Local Storage/chrome-extension_" + config.onetab_ext_id + "_0.localstorage";
    } else {
        path = pathForTest;
    }

    return new Promise((resolve, reject) => {
        console.log('path - ', path)
        try {
            console.log('openSqliteDb 2!')
            fs.accessSync(path);
        } catch (e) {
            console.log('openSqliteDb 3!')
            reject (e);
            return;
        }

        let db = new sqlite3.Database(path);

        console.log('openSqliteDb 4!')

        db.serialize(() => {
            db.get("SELECT key,value FROM ItemTable WHERE key = ?", "state", (err, row) => {
                if (err) {
                    reject(err)
                } else {
                    console.log('createSqliteDBInterface!')
                    resolve(createSqliteDBInterface(db, row.key));
                }
            })
        })
    });
}

const createSqliteDBInterface = (db, key) => {
    return {
        get: () => new Promise((resolve, reject) => {
            db.get("SELECT key,value FROM ItemTable WHERE key = '" + key +  "'", (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row.value.toString("UTF-8"));
                }
            })
        }),
        put: (value) => new Promise((resolve, reject) => {
            db.run("UPDATE ItemTable SET value = ? WHERE key = ?", new Buffer.from(value, "UTF-8"), key, (err, res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve();
                }
            })
        }),
        close: () => {
            return new Promise((resolve, reject) => {
                db.close((err) => {
                    if (err) reject(err);
                    else resolve();
                })
            })
        }
    }
};

export default openOneTabDB;
