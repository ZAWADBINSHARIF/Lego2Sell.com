

const createSuccessResponse = (data, message = 'Success', status = 200) => ({
    success: true,
    status,
    message,
    data,
  });
    
 
  const createErrorResponse = (code = 400, message = "Failure", data = null) => ({
    success: false,
    status: code,
    message,
    data,
  });


  module.exports = {
    createSuccessResponse,
    createErrorResponse,
  };

  