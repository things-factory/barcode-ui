import { LitElement, html, css } from 'lit-element'
import bwipjs from 'bwip-js'

export class BarcodeTag extends LitElement {
  static get properties() {
    return {
      bcid: String,
      bcWidth: Number,
      bcheight: Number,
      bcScale: Number,
      value: String
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          align-items: center;
        }
      `
    ]
  }

  render() {
    return html`
      <canvas></canvas>
    `
  }

  updated(changes) {
    console.log('updated', this.bcid, this.value)
    var options = {
      bcid: this.bcid || 'code128',
      width: this.bcWidth || 20,
      height: this.bcHeight || 6,
      scale: this.bcScale || 4,
      text: this.value || '12345678990',
      includetext: false,
      textalign: 'center'
    }

    let canvas = this.shadowRoot.querySelector('canvas')

    bwipjs(canvas, options, function(err, cvs) {
      if (err) {
        // handle the error
      } else {
        // Don't need the second param since we have the canvas in scope...
        // document.getElementById(myimg).src = canvas.toDataURL('image/png')
      }
    })
  }
}

customElements.define('barcode-tag', BarcodeTag)
