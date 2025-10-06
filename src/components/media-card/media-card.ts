import type { CustomCloudinaryAsset } from '../../clients/cloudinary.ts';

export default class MediaCard extends HTMLElement {
  #CLOUDINARY_BASE_URL;

  constructor() {
    super();

    this.#CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dbjwlulpm/';
  }

  async connectedCallback() {
    const asset: CustomCloudinaryAsset = JSON.parse(this.getAttribute('asset'));
    const { alt = '', format, height, width, publicId, resourceType } = asset;
    const cloudinaryAssetUrl = `${this.#CLOUDINARY_BASE_URL}${resourceType}/upload/c_scale,h_400/`;
    let tag = '';

    switch (resourceType) {

      case 'image':
        tag = `
          <img
            height="${height}"
            width="${width}"
            src="${cloudinaryAssetUrl}f_auto/${encodeURIComponent(publicId)}"
            alt="${alt}"
            loading="lazy"
          />
        `;
        break;
      case 'video':
        tag = `
          <video
            controls
            loading="lazy"
          >
            <source src="${cloudinaryAssetUrl}f_mp4/${encodeURIComponent(publicId)}#t=0.1" type="video/mp4" />
          </video>
        `;
        break;
      default:
        console.debug('Unsupported format detected => ', { format, publicId });

    }

    this.innerHTML = tag;
  }
}

customElements.define('ts-media-card', MediaCard);