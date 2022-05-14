(function(global) {                           // Set up a namespace for our utility
  var utilsajax={};
  function getRequestObject() {                 // Returns an HTTP request object
    if (global.XMLHttpRequest) {
      return (new XMLHttpRequest());
    }
    else if (global.ActiveXObject) {            // For very old IE browsers (optional)
      return (new ActiveXObject("Microsoft.XMLHTTP"));
    }
    else {
      global.alert("Ajax is not supported!");
      return(null); 
    }
  }
                                              // Makes an Ajax GET request to 'requestUrl'
utilsajax.sendGetRequest=function(requestUrl,responseHandler,isJsonResponse) {
  var respuesta=getRequestObject();
  respuesta.onreadystatechange=function() {
    handleResponse(respuesta,responseHandler,isJsonResponse);
  };
  respuesta.open("GET",requestUrl,true);
  respuesta.send(null);                         // for POST only
};
function handleResponse(respuesta,responseHandler,isJsonResponse) {
  if ((respuesta.readyState==4) && (respuesta.status==200)) {
    if (isJsonResponse==undefined) {
      isJsonResponse=true;
    }
    if (isJsonResponse) {
      responseHandler(JSON.parse(respuesta.responseText));
    }
    else {
      responseHandler(respuesta.responseText);
    }
  }
}
global.$utilsajax=utilsajax;      // Expose utility to the global object
})(window);