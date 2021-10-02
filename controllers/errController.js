function errController(err, req, res, next) {
    console.log(err);

    let code;
    let msg;

    res.status(code || err.code || 500).send({ msg: msg || err.message });
}

module.exports = { errController };