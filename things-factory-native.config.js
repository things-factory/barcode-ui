module.exports = {
  onMessage: function({ iab, type, detail = {} }) {
    if (type != 'scan-barcode') return
    var { barcodeTypes = [], requester } = detail

    var barcodes = barcodeTypes.join(',') || null

    cordova.plugins.barcodeScanner.scan(
      function(result) {
        iab.executeScript({
          code: `window.dispatchEvent(
            new CustomEvent('barcode-respond', {
              detail: {
                value: "${result.text}",
                responder: "${requester}"
              }
            })
          );`
        })
      },
      function(error) {
        alert('Scanning failed: ' + error)
      },
      {
        showFlipCameraButton: true, // iOS and Android
        showTorchButton: true, // iOS and Android
        torchOn: true, // Android, launch with the torch switched on (if available)
        saveHistory: true, // Android, save scan history (default false)
        prompt: 'Place a barcode inside the scan area', // Android
        resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
        formats: barcodes,
        // formats: 'QR_CODE,PDF_417', // default: all but PDF_417 and RSS_EXPANDED
        disableAnimations: false, // iOS
        disableSuccessBeep: false // iOS and Android
      }
    )
  }
}

module.exports['plugins'] = ['cordova-plugin-qr-barcode-scanner']

// window.addEventListener('barcode-respond', e => {
// 	console.log('barcode-respond', e)
// })
