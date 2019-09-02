export default function route(page) {
  switch (page) {
    case 'barcode-ui-test':
      import('./pages/barcode-ui-test-page')
      return page
  }
}
