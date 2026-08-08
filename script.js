// ===============================
// QR CODE GENERATOR
// ===============================

function generateQR() {

    const text = document.getElementById("qrText").value.trim();
    const container = document.getElementById("qrContainer");
    const downloadBtn = document.getElementById("downloadBtn");

    const qrColor = document.getElementById("qrColor").value;
    const bgColor = document.getElementById("bgColor").value;
    const qrSize = Number(document.getElementById("qrSize").value);

    if (text === "") {
        alert("Please enter some text or a URL.");
        return;
    }

    container.innerHTML = "";

    new QRCode(container, {
        text: text,
        width: qrSize,
        height: qrSize,
        colorDark: qrColor,
        colorLight: bgColor,
        correctLevel: QRCode.CorrectLevel.H
    });

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

            saveToHistory(decodedText);
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

// ===============================
// SCAN HISTORY
// ===============================

function saveToHistory(result) {

    let history =
        JSON.parse(localStorage.getItem("qrHistory")) || [];

    // Avoid adding the same result repeatedly
    if (history.includes(result)) {
        return;
    }

    history.unshift(result);

    // Keep only the latest 10 scans
    history = history.slice(0, 10);

    localStorage.setItem(
        "qrHistory",
        JSON.stringify(history)
    );

    displayHistory();
}


function displayHistory() {

    const historyList =
        document.getElementById("historyList");

    const history =
        JSON.parse(localStorage.getItem("qrHistory")) || [];

    if (history.length === 0) {

        historyList.innerHTML = `
            <p class="empty-history">
                No scans yet.
            </p>
        `;

        return;
    }

    historyList.innerHTML = history
        .map((item, index) => `
            <div class="history-item">

                <span>${escapeHTML(item)}</span>

                <button
                    onclick="copyHistoryItem(${index})"
                >
                    Copy
                </button>

            </div>
        `)
        .join("");
}


function copyHistoryItem(index) {

    const history =
        JSON.parse(localStorage.getItem("qrHistory")) || [];

    navigator.clipboard.writeText(history[index])
        .then(() => {
            alert("Copied!");
        });
}


function clearHistory() {

    localStorage.removeItem("qrHistory");

    displayHistory();
}


function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}

displayHistory();
