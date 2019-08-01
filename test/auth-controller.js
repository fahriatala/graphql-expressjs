const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');
const configTest = require("../config/config_test");


const User = require('../api/models/user');
const UserController = require('../api/controllers/user');

describe('Auth Controller', function() {
    before(function(done) {
        mongoose.connect(configTest.mongoURI,
            {
              useNewUrlParser: true,
              useCreateIndex: true
            }
        )
        .then(result => {
            const user = new User({
                email: 'fahri2@mailinator.com',
                password: 'testing',
                _id: '5d359d6438eac2d15ed6993b'
            });
            return user.save();
        })
        .then(() => {
            done();
        })
    })


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

    it('should send a response with a valid user email for an existing user', function(done){
        const req = {
            body: {
                userId: '5d359d6438eac2d15ed6993b'
            }
        };
        const res = {
            statusCode: 500,
            userEmail: null,
            email: function(code){
                this.statusCode = code; 
                return this;
            },
            json: function(data) {
                this.userEmail = data.email;
                return this;
            }
        };
           
        UserController.getUserEmail(req, res, () => {}).then(() => {
            expect(res.userEmail).to.be.equal('fahri2@mailinator.com'); 
            done();
        });
    });

    after(function(done) {
        User.deleteMany({})
            .then(() => {
                return mongoose.disconnect();
            })
            .then(() => {
                done();
            });
    });
});