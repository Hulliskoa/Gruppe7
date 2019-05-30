// https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016  ASYNC MIDDLEWARE


module.exports = {
// middleware function to await callback from api endpoint before rendering page-content
asyncMiddleware: fn =>
    (req, res, next) => {
        Promise.resolve(fn(req, res, next))
        .catch(next);
    }
}