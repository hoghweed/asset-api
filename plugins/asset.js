'use strict'
const assetBuilder = require('@vivoil/asset-service')
const levelup = require('levelup');
const Joi = require('joi');
const options = {
    createIfMIssing: true,
    valueEncoding: 'json'
}

module.exports.register = function(server, options, next) {

    const db = levelup('./db', options);
    const service = assetBuilder(db);

    function insert(request, reply) {
        service.insert({ name: request.payload.name },
            (err, value) => {
                if (err) reply({ status: "error" }).code(500);
                else
                    reply(value).code(201);
            })
    }

    function update(request, reply) {
        service.update({
            id: request.params.id,
            status: request.payload.status
        }, (err, value) => {
            if (err) throw err;

            service.query({ id: request.params.id }, (err, value) => {
                if (err) reply({ status: "error" }).code(500);
                else
                    reply(value).code(200)
            })
        })
    }

    function query(request, reply) {
        service.query({ id: request.params.id }, (err, value) => {
            if (err) reply({ status: "error" }).code(500);
            else
                reply(value).code(200)
        })
    }

    server.route({
        method: 'POST',
        path: '/',
        config: {
            handler: insert,
            description: 'Create a new asset',
            notes: 'Creates a new asset object returning its identifier',
            tags: ['api', 'create']
        }
    })

    server.route({
        method: 'PUT',
        path: '/{id}',
        config: {
            handler: update,
            description: 'Update an asset',
            notes: 'Permit to updatse an asset object by its identifier',
            tags: ['api', 'update'],
            validate: {
                params: {
                    id: Joi.string().required().description('asset identifier')
                }
            }
        }
    })

    server.route({
        method: 'GET',
        path: '/{id}',
        config: {
            handler: query,
            description: 'Get an asset',
            notes: 'Returns an asset object by its identifier',
            tags: ['api', 'query'],
            validate: {
                params: {
                    id: Joi.string().required().description('asset identifier')
                }
            }
        }
    })

    next()
}

module.exports.register.attributes = {
    name: 'assetApi',
    version: '0.0.1'
}