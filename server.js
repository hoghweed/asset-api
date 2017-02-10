'use strict';

const Hapi = require('hapi')
const xtend = require('xtend')
const minimist = require('minimist')
const Inert = require('inert')
const Vision = require('vision')
const HapiSwagger = require('hapi-swagger')
const Pack = require('./package')


const defaults = {
    port: 8989,
    info: {
        'title': 'Test API Documentation',
        'version': Pack.version,
    }
}

function build(opts, cb) {
    opts = xtend(defaults, opts)

    const server = new Hapi.Server()

    server.connection({ host: 'localhost', port: opts.port })

    server.register([
        Inert,
        Vision,
        require('./plugins/asset'),
        {
            'register': HapiSwagger,
            'options': { info: opts.info }
        }
    ], (err) => {
        cb(err, server)
    })

    return server
}

function start(opts) {
    build(opts, (err, server) => {
        if (err) { throw err }

        server.start(function(err) {
            if (err) { throw err }

            console.log('Server running at:', server.info.uri)
        })
    })
}

module.exports = build

if (require.main === module) {
    start(minimist(process.argv.slice(2), {
        integer: 'port',
        alias: {
            'port': 'p'
        }
    }))
}