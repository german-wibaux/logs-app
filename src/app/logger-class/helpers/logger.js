const Database = require('./database');
const log = require('../models/Log');


class Logger {
    static _log(level, message) {
        return new Promise((resolve, reject) => {
            Database.connect().then(
                () => {
                    log.create({ level, message }, function(err) {
                        if (err) {
                            console.log(err);
                            reject();
                        } else {
                            console.log('Log created');
                            resolve();
                        }
                    });
                },
                (err) => {
                    console.log(err);
                    reject();
                }
            )
        });
    }

    static _search(startDate, endDate, level, message, limit) {
        return new Promise((resolve, reject) => {
            Database.connect().then(
                () => {
                    let _query = {};
                    let _time = {};
                    let query;
                    if ((startDate) && (!endDate)) {
                        _time.$gt = startDate;
                        _query.timestamp = _time;
                    }

                    if ((!startDate) && (endDate)) {
                        _time.$lt = endDate;
                        _query.timestamp = _time;
                    }

                    if ((startDate) && (endDate)) {
                        _time.$gt = startDate;
                        _time.$lt = endDate;
                        _query.timestamp = _time;
                    }
                    if (level) {
                        _query.level = level;
                    }
                    if (message) {
                        const _message = { "$regex": message, "$options": "i" };
                        _query.message = _message;
                    }

                    if (limit) {
                        query = log.find(_query).limit(parseInt(limit));
                    } else {
                        query = log.find(_query)
                    }

                    query.exec(function(err, logs) {
                        if (err)
                            return console.log(err);
                        logs.forEach(function(log) {
                            console.log(log);
                        });
                    });

                },
                (err) => {
                    console.log(err);
                    reject();
                }
            )
        });
    }

    static info(message) {
        return this._log('INFO', message);
    }

    static debug(message) {
        return this._log('DEBUG', message);
    }

    static error(message) {
        return this._log('ERROR', message);
    }

    static search(startDate, endDate, level, message, limit) {
        return new Promise((resolve, reject) => {
            this._search(startDate, endDate, level, message, limit);
        });
    }

}

module.exports = Logger;