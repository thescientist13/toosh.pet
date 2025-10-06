import { getAssetsByFolder } from '../clients/cloudinary.ts';
import '../components/media-card-grid/media-card-grid.ts'

export default class HomePage extends HTMLElement {
  async connectedCallback() {
    const assets = await getAssetsByFolder('Tosh');

    this.innerHTML = `
      <ts-media-card-grid assets='${JSON.stringify(assets)}'></ts-media-card-grid>
    `;
  }
}