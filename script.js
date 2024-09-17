// script.js

// DOM elements
const qrContainer = document.getElementById('qr-container');
const qrInput = document.getElementById('qr-input');
const qrType = document.getElementById('qr-type');
const downloadBtn = document.getElementById('download-btn');
const copyLinkBtn = document.getElementById('copy-link-btn');

// Show/hide input fields and clear previous QR code on type change
qrType.addEventListener('change', () => {
    qrInput.value = '';
    qrContainer.innerHTML = ''; // Clear previous QR code
    downloadBtn.style.display = 'none'; // Hide download button
    copyLinkBtn.style.display = 'none'; // Hide copy link button

    if (qrType.value === 'location') {
        getLocation();
    }
});

// Fetch the user's current location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            qrInput.value = `${latitude},${longitude}`;
        }, () => {
            alert('Unable to retrieve your location.');
        });
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}

// Paste text from clipboard
function pasteText() {
    navigator.clipboard.readText().then(text => {
        qrInput.value = text;
    }).catch(err => {
        console.error('Failed to read clipboard contents: ', err);
    });
}

// Generate the QR Code based on the input type
function generateQRCode() {
    const type = qrType.value;
    let data = qrInput.value;

    if (data) {
        // Handle different types of input
        if (type === 'email') {
            data = `mailto:${data}`;
        } else if (type === 'location') {
            data = `geo:${data}`;
        }
        createQRCode(data);
    } else {
        alert('Please enter a value!');
    }
}

// Create and display the QR code
function createQRCode(data) {
    qrContainer.innerHTML = ''; // Clear previous QR code
    const canvas = document.createElement('canvas'); // Create a new canvas element
    QRCode.toCanvas(canvas, data, { width: 250, height: 250 }, function(error) {
        if (error) {
            console.error(error);
            alert('Error generating QR Code');
            return;
        }
        qrContainer.appendChild(canvas); // Append the canvas to the container
        downloadBtn.style.display = 'block'; // Show the download button
        copyLinkBtn.style.display = 'block'; // Show the copy link button
    });
}

// Download the generated QR code
function downloadQRCode() {
    const canvas = qrContainer.querySelector('canvas');
    if (!canvas) {
        alert('No QR code to download!');
        return;
    }
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr-code.png';
    a.click();
}

// Copy the download link to the clipboard
function copyLink() {
    const canvas = qrContainer.querySelector('canvas');
    if (!canvas) {
        alert('No QR code available to copy link!');
        return;
    }
    const url = canvas.toDataURL('image/png');
    navigator.clipboard.writeText(url).then(() => {
        alert('Download link copied to clipboard!');
    }).catch((error) => {
        console.error('Failed to copy link: ', error);
    });
}
