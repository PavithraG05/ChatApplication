const errorHandler = ((error, req, res, next)=>{

    error.statusCode = error.statusCode||500;
    error.status=error.status||'error';
    error.message=error.message||'error occured';
    
    res.status(error.statusCode).json({
        statusCode: error.statusCode,
        status:error.status,
        message:error.message,
    })
})

module.exports = errorHandler;