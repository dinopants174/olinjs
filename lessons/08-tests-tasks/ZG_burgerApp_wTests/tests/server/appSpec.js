var request = require('supertest');
var app = require('./../../app.js');

describe("The app", function() {
  it('should respond with the correct html on GET /ingredients', function(done) {
    request(app)
      .get('/ingredients')
      .expect('Content-Type', 'text/html; charset=utf-8', done);
  });

  it('should respond with the correct html on GET /order', function(done) {
    request(app)
      .get('/order')
      .expect('Content-Type', 'text/html; charset=utf-8', done);
  });

  it('should respond with the correct html on GET /kitchen', function(done) {
    request(app)
      .get('/kitchen')
      .expect('Content-Type', 'text/html; charset=utf-8', done);
  });

  it('should return 200 OK on POST /postIngredient', function(done) {
    request(app)
	  .post('/postIngredient')
	  .send({"name":"lettuce", "price": "2"})
	  .expect(200, done);
  });

  it('should return 200 OK on POST /postStock', function(done) {
    request(app)
	  .post('/postStock')
	  .send({"isDisabled":"true", "ingredientId": "56c66b6d2f66782b1ad16282"})
	  .expect(200, done);
  });

  it('should return 200 OK on POST /postEdit', function(done) {
    request(app)
	  .post('/postEdit')
	  .send({"newName":"green", "newPrice":"5", "ingredientId": "56c66b6d2f66782b1ad16282"})
	  .expect(200, done);
  });

  it('should return 200 OK on POST /postOrder', function(done) {
    request(app)
	  .post('/postOrder')
	  .send({"name":"Nitya", "price":"0", "selectedIngredients": []})
	  .expect(200, done);
  });

  it('should return 200 OK on POST /postCompleted', function(done) {
    request(app)
	  .post('/postCompleted')
	  .send({"orderId": "56c66d826a8c025b1a739cec"})
	  .expect(200, done);
  });

});
