mockappServices.service("cameraService", function(){

  var config = {
    quality: 50,
    destinationType: 0,
    sourceType: 1,
    allowEdit: true,
    encodingType: 0,
    correctOrientation: true,
    saveToPhotoAlbum: false,
    cameraDirection: 0
  }
  var result = {isValid:false, msg:"", data:null}

  this.getPicture = function(customConfig, callback){
    var bindConfig = mockapp.parseConfig(customConfig, config);
    if(mockapp.isDevice()){
      mockapp.waitEvent("onDevice", function(){
        navigator.camera.getPicture(function(res){
          result.isValid=true;
          if(bindConfig.destinationType===0 && bindConfig.encodingType===0){
            result.data = "data:image/jpeg;base64," + res;
          } else if(bindConfig.destinationType===0 && bindConfig.sourceType===1){
            result.data = "data:image/png;base64," + res;
          } else {
            result.data = res;
          }
          callback(result);
        }, function(message){
          result.msg = message;
          callback(result);
        }, bindConfig);
      });
    } else {
      var canvas = document.createElement('canvas');
      var context = canvas.getContext("2d");
      var video = document.createElement("video");
      var videoObj = { "video": true };
      var errBack = function(error) {
              console.log("Video capture error: ", error);
              result.msg = error;
              callback(result);
      };
      if(navigator.getUserMedia) {
          navigator.getUserMedia(videoObj, function(stream) {
              video.src = stream;
              video.play();
          }, errBack);
      } else if(navigator.webkitGetUserMedia) {
          navigator.webkitGetUserMedia(videoObj, function(stream){
              video.src = window.webkitURL.createObjectURL(stream);
              video.play();
          }, errBack);
      }
      else if(navigator.mozGetUserMedia) {
          navigator.mozGetUserMedia(videoObj, function(stream){
              video.src = window.URL.createObjectURL(stream);
              video.play();
          }, errBack);
      }
      video.addEventListener("click", function(){
        canvas.getContext("2d").drawImage(video, 0, 0, mockapp.screenWidth, mockapp.screenHeight);
        result.data = canvas.toDataURL();
        result.isValid=true;
        callback(result);
      }, false);
    }
  }

});
