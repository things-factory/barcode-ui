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
          align-items: center;

          padding: initial;
          border: 0;
        }

        :host * {
          align-self: stretch;
        }

        input {
          margin: 5px 0;
        }

        barcode-tag {
          margin: 5px 0;
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
