import { LitElement, html, css } from 'lit-element'
import { BrowserMultiFormatReader } from '@zxing/library'

import barcodeIcon from '../../assets/images/barcode.png'
import { openPopup } from '@things-factory/layout-base'

class ScanCameraTemplate extends LitElement {
  static get styles() {
    return css`
      video {
        height: 400px;
        width: 600px;
        background-color: white;
      }
    `
  }

  get video() {
    return this.shadowRoot.querySelector('video')
  }

  render() {
    return html`
      <video id="video" width="300" height="200" style="border: 1px solid gray"></video>
    `
  }
}

customElements.define('scan-camera-template', ScanCameraTemplate)

/* BarcodeScanableInput is using mediadevice api of html5 */
export class BarcodeScanableInput extends LitElement {
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
          flex-direction: row;
          align-items: center;
          padding: initial;
          border: 0;
          overflow: hidden;
        }

        * {
          align-self: stretch;
        }

        input {
          flex: 1;
        }

        #scan-button {
          width: 50px;
          height: 50px;
          flex-grow: 0;
          flex-shrink: 0;
          border: none;
          padding: 0;
          border: 1px solid #ccc;
          border-radius: 10px;
          background-repeat: no-repeat;
          background-position: center;
          background-size: 70%;
          background-image: var(--barcodescan-input-button-icon);
        }
      `
    ]
  }

  connectedCallback() {
    super.connectedCallback()

    this.reader = new BrowserMultiFormatReader()

    this.renderRoot.addEventListener('focusout', e => {
      this.stopScan()
    })
  }

  disconnectedCallback() {
    this.stopScan()
  }

  render() {
    this.style.setProperty('--barcodescan-input-button-icon', `url(${barcodeIcon})`)

    return html`
      <input type="text" .value=${this.value || ''} />
      <button
        id="scan-button"
        @click=${e => {
          this.scan(e)
        }}
      ></button>
    `
  }

  get input() {
    return this.shadowRoot.querySelector('input')
  }

  async scan(e) {
    try {
      this.input.focus()

      /* video on */
      var template = document.createElement('scan-camera-template')

      this.popup = openPopup(template, {
        backdrop: true
      })

      /* template.video가 생성된 후에 접근하기 위해서, 한 프레임을 강제로 건너뛴다. */
      await this.updateComplete

      // var devices = await this.reader.getVideoInputDevices()

      // var result = await this.reader.decodeFromInputVideoDevice(devices[0].deviceId, template.video)
      var result = await this.reader.decodeFromInputVideoDevice(undefined, template.video)

      this.input.value = result
    } catch (err) {
      console.error(err)
    } finally {
      /* video off */
      this.stopScan()
    }
  }

  stopScan() {
    this.reader.reset()
    this.popup && this.popup.close()
    delete this.popup
  }
}

customElements.define('barcode-scanable-input', BarcodeScanableInput)
