import HeroCarousel from "../components/carousel/HeroCarousel.html"
import ProductCarousel from "../components/carousel/ProductCarousel.html"

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
