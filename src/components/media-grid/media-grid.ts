import '../media-card/media-card.ts';
import type { CustomCloudinaryAsset } from '../../clients/cloudinary.ts';

// masonry layout curtesy of
// https://flowbite.com/docs/components/gallery/
export default class MediaGrid extends HTMLElement {
  async connectedCallback() {
    const STACK_HEIGHT = 3;
    const STACK_WIDTH = 3;
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
      if (idx === 0 || (idx % (STACK_HEIGHT * STACK_WIDTH) === 0)) {
        stackIndex += 1;
        stacks[stackIndex] = [];
      }

      const stackX = idx % STACK_WIDTH;
      const stackY = Math.floor(idx / STACK_WIDTH) - (STACK_WIDTH * stackIndex);

      if (!stacks[stackIndex][stackY]) {
        stacks[stackIndex][stackY] = [null, null, null];
      }

      stacks[stackIndex][stackY][stackX] = asset;
    });

    let layout = '';

    stacks.forEach((stack) => {
      const groups = Array(STACK_WIDTH).fill('<div class="grid gap-4">');

      stack.forEach((row) => {
        row.forEach((asset, x) => {

          groups[x] += `
            <div>
              <ts-media-card 
                class="h-auto max-w-full rounded-lg"
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
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        ${layout}
      </div>
    `;
  }
}

customElements.define('ts-media-grid', MediaGrid);