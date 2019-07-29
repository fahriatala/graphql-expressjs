const expect = require('chai').expect;
const sinon = require('sinon');

const User = require('../api/models/user');
const UserController = require('../api/controllers/user');

describe('Auth Controller - Login', function() {
    it('Should throw an error w/ 500 if fail to access the database', function(done) {
        sinon.stub(User, 'findOne');
        User.findOne.throws();

        const req = {
            body: {
                email: 'fahri@test.com',
                password: 'testing'
            }
        };

        UserController.userLogin(req, {}, () => {}).then(result => {
            expect(result).to.be.an('error');
            expect(result).to.have.property('statusCode', 500);
            done();
        });

        User.findOne.restore();
    });
});