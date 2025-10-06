import '../media-card/media-card.ts';
import type { CustomCloudinaryAsset } from '../../clients/cloudinary.ts';

// masonry layout curtesy of
// https://flowbite.com/docs/components/gallery/
export default class MediaCardGrid extends HTMLElement {
  // probably should sync these to gap + cols
  #STACK_HEIGHT = 3;
  #STACK_WIDTH = 3;
  #DEFAULT_ROTATION = 'center';
  #ROTATION_CLASS_MAPPER = {
    center: 'rotate-0',
    left: '-rotate-1',
    right: 'rotate-1'
  };

  async connectedCallback() {
    // TODO: assumes at least 9 items are passed in, or should otherwise better handle "empty" spaces in the grid
    const assets: CustomCloudinaryAsset[] = JSON.parse(this.getAttribute('assets') || '[]');
    const stacks: Array<CustomCloudinaryAsset>[][] = [];
    // 0
    // 0 1 2
    // 3 4 5
    // 6 7 8

    // 1
    // 9 10 11
    // 12 13 14
    // 15 16 17

    // 2
    // 9 10 11
    // 12

    // TODO can we get rid of stackIndex?
    let stackIndex = -1;

    assets.forEach((asset, idx) => {
      if (idx === 0 || (idx % (this.#STACK_HEIGHT * this.#STACK_WIDTH) === 0)) {
        stackIndex += 1;
        stacks[stackIndex] = [];
      }

      const stackX = idx % this.#STACK_WIDTH;
      const stackY = Math.floor(idx / this.#STACK_WIDTH) - (this.#STACK_WIDTH * stackIndex);

      if (!stacks[stackIndex][stackY]) {
        stacks[stackIndex][stackY] = [null, null, null];
      }

      stacks[stackIndex][stackY][stackX] = asset;
    });

    let layout = '';

    stacks.forEach((stack) => {
      const groups = Array(this.#STACK_WIDTH).fill('<div class="grid gap-3">');

      stack.forEach((row) => {
        row.forEach((asset, idx) => {
          const rotation = idx % 2 === 0 ? 'left' : 'right';
          const rotationClass = this.#ROTATION_CLASS_MAPPER[rotation]

          groups[idx] += `
            <div>
              <ts-media-card 
                class="${rotationClass} inline-block h-auto max-w-full rounded-lg m-2 border-yellow-600 border-2"
                asset='${JSON.stringify({ ...asset, alt: 'Toosh' }).replace(/'/g, '\\"')}'
              /></ts-media-card>
            </div>
          `;
        });
      });

      groups.forEach((group, idx) => {
        groups[idx] += '</div>';
      });

      layout += groups.join('');
    });

    this.innerHTML += `
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
        ${layout}
      </div>
    `;
  }
}

customElements.define('ts-media-card-grid', MediaCardGrid);