const URL = "https://teachablemachine.withgoogle.com/models/FbAF_WNDK/";

let model, labelContainer, maxPredictions;
let video;
let fraction1Detected = false;

async function init() {
  if (video) {
    video.pause();
    video.srcObject = null;
    video.remove();
  }

  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    labelContainer.appendChild(document.createElement("div"));
  }

  video = document.createElement("video");
  video.setAttribute("playsinline", "");
  video.setAttribute("autoplay", "");
  video.setAttribute("muted", "");
  video.setAttribute("width", 900);
  video.setAttribute("height", 900);

  // Get user media from back camera
  const constraints = {
    audio: false,
    video: {
      facingMode: { exact: "environment" },
      width: { exact: 900 },
      height: { exact: 900 }
    }
  };
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
  } catch (error) {
    console.error("Oops. Something is broken.", error);
  }

  video.addEventListener("loadedmetadata", () => {
    predict();
  });
  document.getElementById("webcam-container").appendChild(video);
}

async function predict() {
  const prediction = await model.predict(video);
  for (let i = 0; i < maxPredictions; i++) {
    if (prediction[i].className === "fraction2" && prediction[i].probability > 0.9 && !fraction1Detected) {
      $(".scan_B_sus").css("display", "inline-block");
      fraction1Detected = true;
    }
  }
  requestAnimationFrame(predict);
}
init();


$(".scan_B_sus").click(function(){
  $(".container-bgB-blank").css("display","none");
   $(".container-bgB-back").css("display","inline-block");
  $(".scan_C_sus").css("display","none");
  // $(".scan_A_sus").prop("src","https://imgur.com/05bf1740-62b9-4895-8333-958087bc32a2");
});

 $.event.special.tap.emitTapOnTaphold = false;
 $(".container-bgB").on("tap", function() {
   $(this).css("display","none");
   $(".container-bgB-blank").css("display","inline-block");
 });