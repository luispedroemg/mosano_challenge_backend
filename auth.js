const authenticate = (req, res, next) => {
  const auth = {login: process.env.API_USERNAME, password: process.env.API_PASSWORD};
  console.log('authenticating');
  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

  if (login && password && login === auth.login && password === auth.password) {
    return next();
  }

  res.set('WWW-Authenticate', 'Basic realm="MosanoChallengeAPI"');
  res.status(401).json([{error:'process', msg:'Authentication required.'}]);
}

module.exports = authenticate;