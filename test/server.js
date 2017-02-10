'use strict'

const code = require('code')
const Lab = require('lab')
const lab = exports.lab = Lab.script({
    output: process.stdout
})
const build = require('../')

lab.experiment('Api usage', () => {
    let server

    lab.beforeEach((done) => {
        build({ port: 8989 }, (err, s) => {
            server = s
            done(s)
        })
    })

    lab.test('Can insert a new asset', (done) => {
        const options = { method: 'POST', url: '/' }
        server.inject(options, function(response) {
            const result = response.result
            code.expect(result).to.be.a.string()
        })
    })

    lab.test('Can update an asset', (done) => {
        const options = { method: 'PUT', url: '/6c84fb90-12c4-11e1-840d-7b25c5ee775a' }
        server.inject(options, function(response) {
            const result = response.result
            code.expect(result).to.be.a.string()
        })
    })

    lab.test('Can query for an  asset', (done) => {
        const options = { method: 'GET', url: '/6c84fb90-12c4-11e1-840d-7b25c5ee775a' }
        server.inject(options, function(response) {
            const result = response.result
            code.expect(result).to.be({ id: '6c84fb90-12c4-11e1-840d-7b25c5ee775a', status: '' })
        })
    })
})