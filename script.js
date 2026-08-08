// ===============================
// QR CODE GENERATOR
// ===============================

function generateQR() {

    const text = document.getElementById("qrText").value.trim();
    const container = document.getElementById("qrContainer");
    const downloadBtn = document.getElementById("downloadBtn");

    if (text === "") {
        alert("Please enter some text or a URL.");
        return;
    }

    // Clear previous QR code
    container.innerHTML = "";

    // Generate QR
    new QRCode(container, {
        text: text,
        width: 220,
        height: 220,
        colorDark: "#111827",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    // Show download button
    downloadBtn.classList.remove("hidden");
}


// ===============================
// DOWNLOAD QR CODE
// ===============================

function downloadQR() {

    const qrImage = document.querySelector("#qrContainer img");

    if (!qrImage) {
        alert("Please generate a QR code first.");
        return;
    }

    const link = document.createElement("a");

    link.href = qrImage.src;
    link.download = "qr-code.png";

    link.click();
}


// ===============================
// TAB SWITCHING
// ===============================

function showSection(sectionName) {

    const sections = document.querySelectorAll(".section");
    const tabs = document.querySelectorAll(".tab");

    sections.forEach(section => {
        section.classList.remove("active-section");
    });

    tabs.forEach(tab => {
        tab.classList.remove("active");
    });

    document.getElementById(sectionName).classList.add("active-section");

    if (sectionName === "generator") {
        tabs[0].classList.add("active");
    } else {
        tabs[1].classList.add("active");

        startScanner();
    }
}


// ===============================
// QR CODE SCANNER
// ===============================

let scannerStarted = false;

function startScanner() {

    if (scannerStarted) {
        return;
    }

    const html5QrCode = new Html5Qrcode("reader");

    const config = {
        fps: 10,
        qrbox: {
            width: 250,
            height: 250
        }
    };

    html5QrCode.start(
        { facingMode: "environment" },
        config,

        function(decodedText) {

            console.log("QR Code detected:", decodedText);

            document.getElementById("resultText").textContent =
                decodedText;

            document
                .getElementById("scanResult")
                .classList.remove("hidden");
        },

        function(errorMessage) {
            // Scanner continuously searches.
            // We don't need to show every scanning error.
        }
    )
    .then(() => {
        scannerStarted = true;
    })
    .catch(error => {

        console.error("Camera error:", error);

        alert(
            "Unable to access camera. Please allow camera permission and use HTTPS or localhost."
        );
    });
}


// ===============================
// COPY RESULT
// ===============================

function copyResult() {

    const result =
        document.getElementById("resultText").textContent;

    navigator.clipboard.writeText(result)
        .then(() => {
            alert("Result copied!");
        })
        .catch(() => {
            alert("Unable to copy result.");
        });
}

// ===============================
// CLEAR GENERATOR
// ===============================

function clearGenerator() {

    document.getElementById("qrText").value = "";

    document.getElementById("qrContainer").innerHTML = `
        <p class="placeholder">
            Your QR code will appear here
        </p>
    `;

    document
        .getElementById("downloadBtn")
        .classList.add("hidden");
}

