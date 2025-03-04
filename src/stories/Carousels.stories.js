import BasicCarousel from '../components/carousel/BasicCarousel.html';
import CarouselTight from '../components/carousel/CarouselTight.html';
import CarouselSnapStart from '../components/carousel/CarouselSnapStart.html';
import CarouselSnapEnd from '../components/carousel/CarouselSnapEnd.html';
import CarouselSnapCenter from '../components/carousel/CarouselSnapCenter.html';
import CarouselSnapPad from '../components/carousel/CarouselSnapPad.html';
import CarouselContent from '../components/carousel/CarouselContent.html';
import CarouselInteractive from '../components/carousel/CarouselInteractive.html';
import CarouselBanner from '../components/carousel/CarouselBanner.html';
import CarouselBannerImageOnly from '../components/carousel/CarouselBannerImageOnly.html';

export default {
  title: 'Carousels',
  parameters: {
    a11y: {
      config: {},
    },
  },
};

export const Basic = () => BasicCarousel;
Basic.storyName = 'Basic Carousel';

export const Tight = () => CarouselTight;
Tight.storyName = 'Tight Carousel';

export const SnapStart = () => CarouselSnapStart;
SnapStart.storyName = 'Snap Start Carousel';

export const SnapEnd = () => CarouselSnapEnd;
SnapEnd.storyName = 'Snap End Carousel';

export const SnapCenter = () => CarouselSnapCenter;
SnapCenter.storyName = 'Snap Center Carousel';

export const SnapPad = () => CarouselSnapPad;
SnapPad.storyName = 'Snap Pad Carousel';

export const WithContent = () => CarouselContent;
WithContent.storyName = 'Carousel with Content';

export const Interactive = () => CarouselInteractive;
Interactive.storyName = 'Interactive Carousel';

export const Banner = () => CarouselBanner;
Banner.storyName = 'Banner Carousel';

export const BannerImage = () => CarouselBannerImageOnly;
BannerImage.storyName = 'Banner Image Carousel';
