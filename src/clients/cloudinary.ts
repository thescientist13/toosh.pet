import { v2 as cloudinary } from 'cloudinary';
import type { ResourceApiResponse } from 'cloudinary';

const MAX_RESULTS = 500; // doubt we'll ever hit this limit...
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

type SUPPORTED_FOLDERS = 'Tosh';

// since Cloudinary doesn't have the great support for TypeScript
// https://github.com/cloudinary/cloudinary_npm/issues/175
export type CustomCloudinaryAsset = {
  alt?: string;
  format: string;
  height: number;
  width: number;
  assetId: string;
  publicId: string;
  secureUrl: string;
  resourceType: string;
}

// https://cloudinary.com/documentation/admin_api#get_resources_by_asset_folder
async function getAssetsByFolder(folderName: SUPPORTED_FOLDERS) {
  let assets: CustomCloudinaryAsset[] = [];

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.warn('**Expected Cloudinary credentials not detected.**');
    return assets;
  }

  try {
    const [images, videos] = await Promise.all([
      cloudinary.api.resources({
        resource_type: 'image',
        max_results: MAX_RESULTS
      }),
      cloudinary.api.resources({
        resource_type: 'video',
        max_results: MAX_RESULTS
      })
    ]);

    assets = [...images.resources, ...videos.resources]
      .filter((asset) => asset.asset_folder === folderName)
      .map((asset) => {
        return {
          ...asset,
          assetId: asset.asset_id,
          publicId: asset.public_id,
          secureUrl: asset.secure_url,
          resourceType: asset.resource_type
        };
      });
  } catch (e) {
    console.error({ e });
  }

  return assets;
}

export { getAssetsByFolder };