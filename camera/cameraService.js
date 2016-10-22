mockappServices.service("cameraService", ['$timeout', function($timeout) {

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
    var bindConfig = config;
    if(arguments.length === 2){
        bindConfig = mockapp.parseConfig(customConfig, config);
    } else {
      callback = customConfig;
    }
    if(navigator.camera){
      navigator.camera.getPicture(function(res){
        result.isValid=true;
        if(bindConfig.destinationType===0 && bindConfig.encodingType===0){
          result.data = "data:image/jpeg;base64," + res;
        } else if(bindConfig.destinationType===0 && bindConfig.sourceType===1){
          result.data = "data:image/png;base64," + res;
        } else {
          result.data = res;
        }
        $timeout(function (){
            callback(result);
        });
      }, function(message){
        result.msg = message;
        callback(result);
      }, bindConfig);
    } else {
      var canvas = document.createElement('canvas');
      canvas.id="canvasBoxCameraService";
      var video = document.createElement("video");
      video.autoplay=true;
      video.id="videoBoxCameraService";
      var close = document.createElement("button");
      close.innerText="X";
      close.classList="small";
      close.style.zIndex="9995";
      close.style.position="absolute";
      close.style.right="15px";
      var info = document.createElement("div");
      info.innerText="Tap the screen to take the picture";
      info.style.zIndex="9994";
      info.style.position="absolute";
      info.style.left="15px";
      info.style.color="#fff";
      info.style.marginTop="15px";

      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
      if (navigator.getUserMedia) {
          navigator.getUserMedia({video: true}, handleVideo, videoError);
      }
      function handleVideo(stream) {
          video.src = window.URL.createObjectURL(stream);
      }

      function videoError(error) {
        console.log("Video capture error: ", error);
        result.msg = error;
        callback(result);
      }
      function removeAllChild(){
        document.body.removeChild(video);
        document.body.removeChild(canvas);
        document.body.removeChild(close);
        document.body.removeChild(info);
      }
      video.addEventListener("click", function(){
        canvas.getContext("2d").drawImage(video, 0,0, canvas.width, canvas.height);
        result.data = canvas.toDataURL();
        result.isValid=true;
        removeAllChild();
        callback(result);
        }, false);
      close.addEventListener("click", function(){
        result.isValid=false;
        removeAllChild();
        callback(result);
      }, false);
      document.body.appendChild(video);
      document.body.appendChild(canvas);
      document.body.appendChild(close);
      document.body.appendChild(info);
    }
  }

}]);
