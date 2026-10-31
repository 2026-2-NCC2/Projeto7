
export function errorMiddleware(err, req, res, next) {
    console.error(err);

    const status = err.status || 500;

    res.status(status).json({
        status: status,
        erro: status === 500 ? "Erro interno do servidor" : err.message
    });
}
