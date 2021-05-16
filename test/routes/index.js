let token = ""
describe('auth success routes', () => {
  describe('POST /signup', () => {
    it('Signs up a new user', (done) => {
      request.post('/signup')
        .send({ username: 'testuser', name: 'testname', password: 'testpass' })
        .expect(201)
        .end((err,res) => done(err));
    });
  });
  describe('POST /login', () => {
    it('Logins as a user', (done) => {
      request.post('/login')
        .send({ username: 'testuser', password: 'testpass' })
        .expect(200)
        .end((err,res) => {
          token = res.body.token
          done(err);
        });
    });
  });
  describe('POST /logout', () => {
    it('Logs a user out', (done) => {
      request.post('/logout')
        .send({ username: 'testuser'})
        .expect(200)
        .end((err,res) => done(err)
        );
    });
  });
  describe("POST /signup", () => {
    it('Should return an error since the user has empty data', (done) => {
      request.post('/signup')
          .send({})
          .expect(406)
          .end((err,res) => done(err))
    });
  });
  describe("POST /login", () => {
    it('Should return an error we are trying to login with incorrect credentials', (done) => {
      request.post('/login')
          .send({username: "wrong",password:"wrong"})
          .expect(403)
          .end((err,res) => done(err))
    });
  });
  describe("DELETE /delete", () => {
    it('Should return an error we are trying to delete a valid user but we are not logged in', (done) => {
      request.delete('/delete')
          .send({username: "testuser"})
          .expect(401)
          .end((err,res) => done(err))
    });
  });
  describe("DELETE /delete", () => {
    it('Should return an error we are trying to delete a valid user but we are logged in with an invalid token', (done) => {
      request.delete('/delete')
          .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5vbmVleGlzdGVudHVzZXIifQ.NryMydpRxdkQs5Lea5Vn5_6ns6UDBx9gnAazuY0cdOg")
          .send({username: "testuser"})
          .expect(400)
          .end((err,res) => done(err))
    });
  });
  describe('DELETE /delete', () => {
    it('Deletes the user', (done) => {
      request.delete('/delete')
        .set("Authorization", "Bearer " + token)
        .send({ username: 'testuser'})
        .expect(200)
        .end((err, res) => done(err));
    });
  });
});