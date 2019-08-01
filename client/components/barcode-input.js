import { LitElement, html, css } from 'lit-element'
import './barcode-tag'

export class BarcodeInput extends LitElement {
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
          flex-direction: column;
          height: 100px;
        }

        input {
          flex: 0 0 auto;
          margin: 0;
        }

        barcode-tag {
          flex: 0 0 auto;
          margin-top: auto;
        }
      `
    ]
  }

  render() {
    return html`
      <input type="text" @change=${this.onchange.bind(this)} />
      <barcode-tag
        .bcid=${this.bcid}
        .value=${this.value}
        .bcWidth=${this.bcWidth}
        .bcHeight=${this.bcHeight}
        .bcScale=${this.bcScale}
      ></barcode-tag>
    `
  }

  onchange(e) {
    this.value = e.target.value
  }
}

customElements.define('barcode-input', BarcodeInput)
