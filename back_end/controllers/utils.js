
exports.response = []
var sendError = exports.response.sendError = function (res, error, code) {

    if (code === undefined) {
      code = 500;
    }
  
    res.status(code).json({
      error: error
    });
  
};
  
var sendSuccess = exports.response.sendSuccess = function (res, success) {
    res.status(200).json({
      success: success
    });
};

var sendObjectData = exports.response.sendData = function(res,data){
  res.status(200).json(data);
}