let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");      //using queryselector we are selecting that particular "record-btn-cont"
let recordBtn = document.querySelector(".record-btn");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");
let transparentColor = "transparent";


let recordFlag = false;

let recorder;       //store undefined     //recorder checks at any point of time,whether it is active or not  //here it is not active,because it stores undefined value
let chunks = [];    //media data(video recording and voice) is stored in chunks(small pieces)

let constraints={
    audio:false,
    video:true,
}
//navigator is a global obj where this gives info about browser
navigator.mediaDevices.getUserMedia(constraints)
.then((stream) => {
    video.srcObject = stream;   //srcObject

    recorder = new MediaRecorder(stream);
    recorder.addEventListener("start",(e)=>{        //the streaming which is happening is given to the "e" object
        chunks = [];                                //whenever the recording is started the chunks should be empty
    })
    recorder.addEventListener("dataavailable",(e)=>{        //dataavailable = once the recorded data is available, we can collect those data by using dataavailable
        chunks.push(e.data);                                //e.data is the current data
    })
    recorder.addEventListener("stop",(e)=>{         //when we are stopping, we have to download the video
        //convert the media chunks data to video
        let blob = new Blob(chunks,{ type: "video/mp4"});
        let videoURL = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = videoURL;
        a.download = "stream.mp4";
        a.click();
    })

    recordBtnCont.addEventListener("click",(e)=>{
        if(!recorder) return;       //recorder is active

        recordFlag = !recordFlag;       //changing the value to true
        if(recordFlag){    //start
            recorder.start();       //start() media recording starts
            recordBtn.classList.add("scale-record");
            startTimer();
        }else{  //stop
            recorder.stop();
            recordBtn.classList.remove("scale-record");
            stopTimer();
        }
    })
});

// video is actually captured as chunks, but what these chunks will have?
//each chunk will be having a frame, image is actually a frame (when clicking on capture
// button ,one such frame should be downloaded.)

captureBtnCont.addEventListener("click",(e)=>{
    captureBtnCont.classList.add("scale-capture");  //adding animations

    let canvas = document.createElement("canvas");  //canvas element helps us to capture the entire screen
    canvas.width = video.videoWidth;        //it will capture the entire video height and width
    canvas.height = video.videoHeight;
    let imageURL = canvas.toDataURL("image/jpeg");



    let tool = canvas.getContext("2d");  //getContext("2d") is responsible to get the data(video context inside specified height & width)
    tool.drawImage(video,0,0,canvas.width,canvas.height);
    //filtering
    tool.fillStyle = transparentColor;  //defaultfilter "transparent"
    tool.fillRect(0,0,canvas.width,canvas.height);


    let a = document.createElement('a');
    a.href = imageURL;
    a.download = "Image.jpeg";
    a.click();

    //remove animations
    setTimeout(()=>{
        captureBtn.classList.remove("scale-capture");
    },500);
})

//filtering logic
let filter = document.querySelector(".filter-layer");

let allFilter = document.querySelectorAll(".filter");
allFilter.forEach((filterElem)=>{
    filterElem.addEventListener("click",(e)=>{
        //get style
        transparentColor = getComputedStyle(filterElem).getPropertyValue("background-color");
        filter.style.backgroundColor = transparentColor;
    })
})







//**** timer part ****

let timerID;
let counter = 0; //Represents total seconds
let timer = document.querySelector(".timer");
function startTimer(){
    timer.style.display = "block";
    function displayTimer(){
        /*
            How to calculate the time is that
            1) Initialize a variable that actually stores no.of seconds
            2) when ever this function displayTimer is called then we need to increment the counter variable,
               as each call of this function is considered as 1sec in regular time.why? because we need to get the 
               actual time when this thing needs counted.
            How to count Hours,Minutes & seconds?
            counter= 3725
            we know 1hr = 3600 seconds ,
            to count 1 hr using counter value, we use '/(division operator)' between 
            counter and 3600 sec.division operator is used to perform floor division
            3725/3600 => 1
            remainder 3725%3600 => no.of minutes in seconds , so we need to convert 
            back to minutes, 1minute = 60seconds
        */
       let totalSeconds = counter;
       let hours = Number.parseInt(totalSeconds/3600);
       totalSeconds = totalSeconds % 3600;
       let minutes = Number.parseInt(totalSeconds/60);
       totalSeconds = totalSeconds % 60;
       let seconds = totalSeconds;

       hours = (hours < 10) ? `0${hours}`:hours;
       minutes = (minutes < 10) ? `0${minutes}`:minutes;
       seconds = (seconds < 10) ? `0${seconds}`:seconds;

       timer.innerText = `${hours}:${minutes}:${seconds}`;

       counter++;
    }
    timerID = setInterval(displayTimer,1000);  //we are calling this function displayTimer()
}
function stopTimer(){
    clearInterval(timerID);
    timer.innerText = "00:00:00";
    timer.style.display = "none";
}