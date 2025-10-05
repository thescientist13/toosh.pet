import { getAssetsByFolder } from '../clients/cloudinary.ts';
import '../components/media-grid/media-grid.ts'

export default class HomePage extends HTMLElement {
  async connectedCallback() {
    const assets = await getAssetsByFolder('Tosh');

    this.innerHTML = `
      <ts-media-grid assets='${JSON.stringify(assets)}'></ts-media-grid>
    `;
  }
}