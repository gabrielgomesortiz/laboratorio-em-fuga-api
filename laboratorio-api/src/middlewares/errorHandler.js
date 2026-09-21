const errorHandler = (err, _req, res, _next) => {
    console.error(err);

    const status = err.statusCode || 500;
    const message = err.message || 'Erro interno do servidor.';

    res.status(status).json({
        success: false,
        message,
    });
};

module.exports = {
    errorHandler,
};
