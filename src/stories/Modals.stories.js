import BackdropModal from '../components/modals/BackdropOnlyModal.html';
import NoBackdropModal from '../components/modals/NoBackdropModal.html';
import ContentModal from '../components/modals/ContentModal.html';
import HeroModal from '../components/modals/HeroModal.html';
import ComplexModal from '../components/modals/ComplexModal.html';
import FullScreenModal from '../components/modals/FullScreenModal.html';
import NoEntranceModal from '../components/modals/NoEntrance.html';

const addOpenAttribute = (htmlString) => {
  return htmlString.replace('<dialog', '<dialog open');
};

export default {
  title: 'Modals',
  parameters: {
    a11y: {
      config: {},
    },
  },
};

export const Basic = () => addOpenAttribute(BasicModal);
Basic.storyName = 'Basic Modal';

export const BackdropClickaway = () => addOpenAttribute(BackdropModal);
BackdropClickaway.storyName = 'Backdrop Click Away';

export const NoBackdrop = () => addOpenAttribute(NoBackdropModal);
NoBackdrop.storyName = 'No Backdrop';

export const Content = () => addOpenAttribute(ContentModal);
Content.storyName = 'Content Structure';

export const Hero = () => addOpenAttribute(HeroModal);
Hero.storyName = 'Hero Image';

export const Complex = () => addOpenAttribute(ComplexModal);
Complex.storyName = 'Complex Modal';

export const Fullscreen = () => addOpenAttribute(FullScreenModal);
Fullscreen.storyName = 'Fullscreen Modal';

export const NoEntrance = () => addOpenAttribute(NoEntranceModal);
NoEntrance.storyName = 'No Entrance Animation Modal';
