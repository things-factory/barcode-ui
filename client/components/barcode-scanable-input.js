import { LitElement, html, css } from 'lit-element'
import { BrowserMultiFormatReader } from '@zxing/library'

import barcodeIcon from '../../assets/images/barcode.png'
import { openPopup } from '@things-factory/layout-base'

class ScanCameraTemplate extends LitElement {
  get video() {
    return this.shadowRoot.querySelector('video')
  }

  render() {
    return html`
      <video></video>
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
      scannable: Boolean,
      withoutEnter: {
        attribute: 'without-enter',
        type: Boolean
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
          display: block;
          width: 30px;
          height: 100%;
          min-height: 24px;
          border: none;
          background-color: transparent;
          background-repeat: no-repeat;
          background-position: center;
          background-image: var(--barcodescan-input-button-icon);
        }

        #scan-button[hidden] {
          display: none;
        }
      `
    ]
  }

  connectedCallback() {
    super.connectedCallback()

    this.scannable = false

    if (navigator.mediaDevices) {
      ;(async () => {
        try {
          var stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
          if (stream) {
            stream.getTracks().forEach(track => track.stop())
            this.scannable = true
          }
        } catch (e) {
          console.warn('this device not support camera for barcode scan', e)
        }
      })()
    }
  }

  disconnectedCallback() {
    this.stopScan()
  }

  render() {
    this.style.setProperty('--barcodescan-input-button-icon', `url(${barcodeIcon})`)

    return html`
      <input type="text" .value=${this.value || ''} />
      <button
        ?hidden=${!this.scannable}
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
      var template = document.createElement('scan-camera-template')

      var popup = openPopup(template, {
        backdrop: true,
        size: 'large',
        closable: false
      })
      popup.onclosed = e => {
        /* 뒤로가기 등으로 popup이 종료된 경우에도 scan 자원을 clear해준다. */
        this.stopScan()
      }

      /* template.video가 생성된 후에 접근하기 위해서, 한 프레임을 강제로 건너뛴다. */
      await this.updateComplete

      var constraints = { video: { facingMode: 'environment' } } /* backside camera first */
      this.stream = await navigator.mediaDevices.getUserMedia(constraints)

      this.reader = new BrowserMultiFormatReader()
      if (!popup.closed && this.stream) {
        var result = await this.reader.decodeOnceFromStream(this.stream, template.video)

        this.input.value = result
        if (!this.withoutEnter) {
          this.dispatchEvent(new KeyboardEvent('keypress', { keyCode: 0x0d }))
        }
      } else {
        /* popup이 비동기 진행 중에 close된 경우라면, stopScan()을 처리하지 못하게 되므로, 다시한번 clear해준다. */
        this.stopScan()
      }
    } catch (err) {
      /*
       * 1. stream device 문제로 예외 발생한 경우.
       * 2. 뒤로가기 등으로 popup이 종료된 경우에도 NotFoundException: Video stream has ended before any code could be detected. 이 발생한다.
       */
      console.warn(err)
    } finally {
      popup.close()

      this.stopScan()
    }
  }

  stopScan() {
    this.stream && this.stream.getTracks().forEach(track => track.stop())
    this.reader && this.reader.reset()

    delete this.stream
    delete this.reader
  }
}

customElements.define('barcode-scanable-input', BarcodeScanableInput)
