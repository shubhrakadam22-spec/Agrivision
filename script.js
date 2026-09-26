/* =========================
   PAGE NAVIGATION
========================= */

const menuItems = document.querySelectorAll(".menu-item");

const pages = document.querySelectorAll(".page");

const response = document.getElementById("response");


menuItems.forEach(function(item) {

    item.addEventListener("click", function() {

        /* Remove active from all menu items */

        menuItems.forEach(function(menu) {

            menu.classList.remove("active");

        });


        /* Activate clicked menu */

        item.classList.add("active");


        /* Get page ID */

        const pageId = item.getAttribute("data-page");


        /* Hide all pages */

        pages.forEach(function(page) {

            page.classList.remove("active");

        });


        /* Show selected page */

        const selectedPage =
            document.getElementById(pageId);


        if (selectedPage) {

            selectedPage.classList.add("active");

        }


        /* Update response */

        const menuName =
            item.querySelector("p").textContent;

        response.textContent =
            menuName + " is now open.";

    });

});



/* =====================================================
   VOICE RECOGNITION
===================================================== */

const micButton =
    document.getElementById("micButton");

const micText =
    document.getElementById("micText");

const language =
    document.getElementById("language");


let recognition = null;

let isListening = false;


/* Check browser support */

if ("webkitSpeechRecognition" in window) {

    recognition =
        new webkitSpeechRecognition();

}

else if ("SpeechRecognition" in window) {

    recognition =
        new SpeechRecognition();

}


/* Microphone */

if (micButton) {

    micButton.addEventListener("click", function() {

        if (!recognition) {

            response.textContent =
                "Voice recognition is not supported. Please use Google Chrome.";

            return;

        }


        if (isListening) {

            recognition.stop();

            return;

        }


        recognition.lang =
            language.value;

        recognition.continuous =
            false;

        recognition.interimResults =
            false;


        try {

            recognition.start();

            isListening = true;

            micButton.classList.add("listening");

            micText.textContent =
                "Listening...";

            response.textContent =
                "Listening to your question...";

        }

        catch (error) {

            console.log(error);

        }

    });

}


/* Voice result */

if (recognition) {

    recognition.onresult = function(event) {

        const spokenText =
            event.results[0][0].transcript;


        response.textContent =
            "You said: " + spokenText;

    };


    recognition.onerror = function(event) {

        console.log(event.error);

        response.textContent =
            "Sorry, I couldn't understand. Please try again.";

    };


    recognition.onend = function() {

        isListening = false;

        micButton.classList.remove("listening");

        micText.textContent =
            "Tap to Speak";

    };

}



/* =====================================================
   CAMERA
===================================================== */

const cameraButton =
    document.getElementById("cameraButton");

const cameraContainer =
    document.getElementById("cameraContainer");

const camera =
    document.getElementById("camera");

const captureButton =
    document.getElementById("captureButton");

const closeCamera =
    document.getElementById("closeCamera");

const canvas =
    document.getElementById("canvas");

const preview =
    document.getElementById("preview");


let cameraStream = null;


/* =========================
   OPEN CAMERA
========================= */

cameraButton.addEventListener("click", async function() {

    try {

        cameraStream =
            await navigator.mediaDevices.getUserMedia({

                video: true,

                audio: false

            });


        camera.srcObject =
            cameraStream;


        cameraContainer.style.display =
            "block";


        preview.style.display =
            "none";


        response.textContent =
            "Camera is ready. Capture a crop image.";

    }

    catch (error) {

        console.log(error);

        response.textContent =
            "Unable to access camera. Please allow camera permission.";

    }

});


/* =========================
   CAPTURE
========================= */

captureButton.addEventListener("click", function() {

    if (!cameraStream) {

        response.textContent =
            "Camera is not active.";

        return;

    }


    canvas.width =
        camera.videoWidth;

    canvas.height =
        camera.videoHeight;


    const context =
        canvas.getContext("2d");


    context.drawImage(

        camera,

        0,

        0,

        canvas.width,

        canvas.height

    );


    const imageData =
        canvas.toDataURL("image/png");


    preview.src =
        imageData;


    preview.style.display =
        "block";


    response.textContent =
        "Crop image captured successfully.";


    stopCamera();

});


/* =========================
   CLOSE CAMERA
========================= */

closeCamera.addEventListener("click", function() {

    stopCamera();

    response.textContent =
        "Camera closed.";

});


/* =========================
   STOP CAMERA
========================= */

function stopCamera() {

    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(function(track) {

                track.stop();

            });

        cameraStream = null;

    }


    camera.srcObject =
        null;


    cameraContainer.style.display =
        "none";

}