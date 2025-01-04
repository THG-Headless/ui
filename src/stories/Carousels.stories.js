import HeroCarousel from "../components/carousel/HeroCarousel.html"

export default {
  title: "Carousels",
  parameters: {
    a11y: {
      config: {},
    },
  },
};

export const Hero = () => HeroCarousel ;
HeroCarousel.storyName = "hero Carousel";
