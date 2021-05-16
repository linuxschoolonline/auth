let token = ""
describe('auth routes', function() {
  describe('POST /signup', function() {
    it('Signs up a new user', function(done) {
      request.post('/signup')
        .send({ username: 'testuser', name: 'testname', password: 'testpass' })
        .expect(201)
        .end(function(err, res) {
          done(err);
        });
    });
  });
  describe('POST /login', function() {
    it('Logins as a user', function(done) {
      request.post('/login')
        .send({ username: 'testuser', password: 'testpass' })
        .expect(200)
        .end(function(err, res) {
          token = res.body.token
          done(err);
        });
    });
  });
  describe('POST /logout', function() {
    it('Logs a user out', function(done) {
      request.post('/logout')
        .send({ username: 'testuser'})
        .expect(200)
        .end(function(err, res) {
          done(err);
        });
    });
  });
  describe('DELETE /delete', function() {
    it('Deletes the user', function(done) {
      request.delete('/delete')
        .set("Authorization", "Bearer " + token)
        .send({ username: 'testuser'})
        .expect(200)
        .end((err, res) => {
          done(err);
        });
    });
  });
});
