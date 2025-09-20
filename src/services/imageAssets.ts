// Image assets for demo data
import potteryImage from "@/assets/pottery-collection.jpg";
import artisanImage from "@/assets/artisan-priya.jpg";
import heroImage from "@/assets/hero-marketplace.jpg";

// Export image paths for use in demo data
export const imageAssets = {
  pottery: potteryImage,
  artisan: artisanImage,
  hero: heroImage,
};

// Default placeholder for missing images
export const placeholderImage = "/placeholder.svg";

// Helper function to get image path
export const getImagePath = (imageName: string): string => {
  switch (imageName) {
    case "pottery":
    case "pottery-collection":
      return imageAssets.pottery;
    case "artisan":
    case "artisan-priya":
      return imageAssets.artisan;
    case "hero":
    case "hero-marketplace":
      return imageAssets.hero;
    default:
      return placeholderImage;
  }
};
