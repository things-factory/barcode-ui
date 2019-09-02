import { html, css } from 'lit-element'
import gql from 'graphql-tag'

import { connect } from 'pwa-helpers/connect-mixin.js'
import { store, PageView, client } from '@things-factory/shell'
import '../components/barcodescan-input'

class BarcodeUiTestPage extends connect(store)(PageView) {
  static get properties() {
    return {}
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;

          width: 100%; /* 전체화면보기를 위해서 필요함. */
          height: 100%;

          overflow: hidden;
        }
      `
    ]
  }

  render() {
    return html`
      <barcodescan-input name="barcodescan-1"></barcodescan-input>
      <barcodescan-input name="barcodescan-2"></barcodescan-input>
      <barcodescan-input name="barcodescan-3"></barcodescan-input>
    `
  }

  async refresh() {
    if (!this._boardId) {
      return
    }
    var response = await client.query({
      query: gql`
        query FetchBoardById($id: String!) {
          board(id: $id) {
            id
            name
            model
          }
        }
      `,
      variables: { id: this._boardId }
    })

    var board = response.data.board

    this._board = {
      ...board,
      model: JSON.parse(board.model)
    }

    this.updateContext()
  }
}

customElements.define('barcode-ui-test-page', BarcodeUiTestPage)
