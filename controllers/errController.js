function errController(err, req, res, next) {
    console.log(err.name);
    console.log(err.message);

    let code;
    let msg;

    if (err.name === "SequelizeUniqueConstraintError") {
        code = 400;
        msg = err.errors[0]?.message;
    }

    res.status(code || err.code || 500).send({ msg: msg || err.message });
}

module.exports = { errController };