import { LitElement, html, css } from 'lit-element'
import barcodeIcon from '../../assets/images/barcode.png'

export class BarcodescanInput extends LitElement {
  static get properties() {
    return {
      name: {
        attribute: true
      },
      value: String
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          align-items: center;
          border: none;
          overflow: hidden;
          background-color: #fff;

          padding: var(--custom-input-barcode-field-padding) !important;
        }

        * {
          align-self: stretch;
        }

        *:focus {
          outline: none;
        }

        input {
          flex: 1 !important;
          border: none;
          font: var(--custom-input-barcode-field-font);
          width: 10px;
          flex-grow: 1;
        }

        #scan-button {
          width: 30px;
          height: 24px;
          border: none;
          background-repeat: no-repeat;
          background-position: center;
          background-image: var(--barcodescan-input-button-icon);
        }
      `
    ]
  }

  connectedCallback() {
    super.connectedCallback()

    this._onBarcodeRespond = e => {
      var { value, responder } = e.detail

      if (responder != this.name) return
      this.value = value
      this.requestUpdate()
    }

    this._onFocusIn = e => {
      window.addEventListener('barcode-respond', this._onBarcodeRespond)
    }

    this._onFocusOut = e => {
      window.removeEventListener('barcode-respond', this._onBarcodeRespond)
    }

    this.renderRoot.addEventListener('focusin', this._onFocusIn)
    this.renderRoot.addEventListener('focusout', this._onFocusOut)
  }

  disconnectedCallback() {
    super.disconnectedCallback()

    if (this._onBarcodeRespond) {
      window.removeEventListener('barcode-respond', this._onBarcodeRespond)
      this._onBarcodeRespond = null
    }
    if (this._onFocusIn) {
      this.renderRoot.removeEventListener('focusin', this._onFocusIn)
      this._onFocusIn = null
    }
    if (this._onFocusOut) {
      this.renderRoot.removeEventListener('focusout', this._onFocusOut)
      this._onFocusOut = null
    }
  }

  render() {
    this.style.setProperty('--barcodescan-input-button-icon', `url(${barcodeIcon})`)

    return html`
      <input type="text" .value=${this.value || ''} />
      <button
        id="scan-button"
        @click=${e => {
          this.requestBarcodeScan(e)
        }}
      ></button>
    `
  }

  requestBarcodeScan(e) {
    if (!cordova_iab) throw 'no-app'

    cordova_iab.postMessage(
      JSON.stringify({
        type: 'scan-barcode',
        detail: {
          requester: this.name,
          barcodeTypes: []
        }
      })
    )
  }
}

customElements.define('barcodescan-input', BarcodescanInput)
