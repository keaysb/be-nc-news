module.exports = (err, req, res, next) => {
    if (err.code === '22P02') {
      res.status(400).send({ msg: 'Bad Request' });
    }
    else if (err.code === '23502'){
          res.status(400).send({msg: 'Missing value on NON NULL property'})
    } next(err);
  };




