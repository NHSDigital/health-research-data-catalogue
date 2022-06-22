"use strict";
const getResponseEndpoint1 = require("./responses/dataset-list-sandbox.json");
const getResponseEndpoint2 = require("./responses/dataset-example-crd-sandbox.json");
const errResponse2 = require("./responses/OperationOutcome-RESOURCE_NOT_FOUND.json");

const log = require("loglevel");


const write_log = (res, log_level, options = {}) => {
    if (log.getLevel()>log.levels[log_level.toUpperCase()]) {
        return
    }
    if (typeof options === "function") {
        options = options()
    }
    let log_line = {
        timestamp: Date.now(),
        level: log_level,
        correlation_id: res.locals.correlation_id
    }
    if (typeof options === 'object') {
        options = Object.keys(options).reduce(function(obj, x) {
            let val = options[x]
            if (typeof val === "function") {
                val = val()
            }
            obj[x] = val;
            return obj;
        }, {});
        log_line = Object.assign(log_line, options)
    }
    if (Array.isArray(options)) {
        log_line["log"] = {log: options.map(x=> {return typeof x === "function"? x() : x })}
    }

    log[log_level](JSON.stringify(log_line))
};


async function status(req, res, next) {
    res.json({
        status: "pass",
        ping: "pong",
        service: req.app.locals.app_name,
        version: req.app.locals.version_info
    });
    res.end();
    next();
}

async function hello(req, res, next) {

    write_log(res, "warn", {
        message: "hello world",
        req: {
            path: req.path,
            query: req.query,
            headers: req.rawHeaders
        }
    });


    res.json({message: "hello world"});
    res.end();
    next();
}


async function datasets(req, res, next) {

    write_log(res, "info", {
        message: "datasets",
        req: {
            path: req.path,
            query: req.query,
            headers: req.rawHeaders
        }
    });

    res.json(getResponseEndpoint1);
    res.end();
    next();
}

async function datasetsId(req, res, next) {

    write_log(res, "info", {
        message: "datasetsId",
        req: {
            path: req.path,
            query: req.query,
            headers: req.rawHeaders
        }
    });

    res.json(getResponseEndpoint2);
    res.end();
    next();
}


async function datasetsError(req, res, next) {

    write_log(res, "info", {
        message: "datasetsError",
        req: {
            path: req.path,
            query: req.query,
            headers: req.rawHeaders,
        }
    });
        res.status(404).json(errResponse2);
    res.end();
    next();
}

module.exports = {
    status: status,
    hello: hello,
    datasets: datasets,
    datasetsId: datasetsId,
    datasetsError: datasetsError
};