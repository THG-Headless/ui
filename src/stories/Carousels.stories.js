import HeroCarousel from "../components/carousel/Banner.html";
import ProductCarousel from "../components/carousel/ProductRail_withBulletsAndControls.html";

export default {
  title: "Carousels",
  parameters: {
    a11y: {
      config: {},
    },
  },
};

export const Hero = () => HeroCarousel;
Hero.storyName = "Hero Carousel";

export const ProductList = () => ProductCarousel;
ProductList.storyName = "Product List Carousel";
