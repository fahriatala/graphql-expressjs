const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');
const configTest = require("../config/config_test");

const Product = require('../api/models/product')
const ProductController = require('../api/controllers/products');

describe('Product Controller', function() {

    before(function(done) {
        mongoose.connect(configTest.mongoURI,
            {
              useNewUrlParser: true,
              useCreateIndex: true
            }
        )
        .then(result => {
            const product = new Product({
                name: 'Test Post',
                price: 2,
                productImage: 'abc'
            });
            return product.save();
        })
        .then(() => {
            done();
        })
    })
    
    it('should add a created post to the product module', function(done) {
        const req = {
          body: {
            name: 'Test Post',
            price: 2
          },
          file: {
            path: 'abc'
          }
        };

        const res = {
            statusCode: 500,
            productStatus: null,
            fakeMessage: null,
            status: function(code){
                this.statusCode = code; 
                return this;
            },
            message: function(codes){
                this.fakeMessage = codes; 
                return this;
            },
            json: function(data) {
                this.productStatus = data.status;
                this.fakeMessage = data.message;
                return this;
            }
        };
        
        ProductController.products_create_product(req, res, () => {}).then(() => {
            expect(res).to.have.property('message');
            expect(res.productStatus).to.be.equal('ok'); 
            expect(res.fakeMessage).to.be.equal('Success Created Product'); 
            done();
        });
      });

      after(function(done) {
        Product.deleteMany({})
            .then(() => {
                return mongoose.disconnect();
            })
            .then(() => {
                done();
            });
    });
      
});