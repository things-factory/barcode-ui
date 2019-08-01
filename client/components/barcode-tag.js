import { LitElement, html, css } from 'lit-element'
import bwipjs from 'bwip-js'

export class BarcodeTag extends LitElement {
  static get properties() {
    return {
      bcid: String,
      bcWidth: Number,
      bcheight: Number,
      bcScale: Number,
      value: String,
      validity: Boolean
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          align-items: center;

          position: relative;
        }

        canvas {
          width: 100%;
          height: 100px;
        }

        [dimmer] {
          display: block;
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background-color: rgba(255, 0, 0, 0.5);
        }
      `
    ]
  }

  render() {
    return html`
      <canvas></canvas>

      ${!this.value || !this.validity
        ? html`
            <div dimmer></div>
          `
        : html``}
    `
  }

  updated(changes) {
    var options = {
      bcid: this.bcid || 'code128', // Barcode type
      height: this.bcHeight || 20, // Bar height, in millimeters
      scale: this.bcScale || 3, // scaling factor
      text: this.value || '12345678990',
      // includetext: true,
      textalign: 'center'
    }

    let canvas = this.shadowRoot.querySelector('canvas')

    bwipjs(canvas, options, (err, cvs) => {
      if (err) {
        console.error(err)
        this.validity = false
      } else {
        this.validity = true
        // document.getElementById(myimg).src = canvas.toDataURL('image/png')
      }
    })
  }
}

customElements.define('barcode-tag', BarcodeTag)
