import ButtonCloseModal from "../components/modals/ButtonCloseModal.html"
import BackdropModal from "../components/modals/BackdropModal.html"
import ClickAwayCloseModal from "../components/modals/ClickAwayCloseModal.html"
import BackdropCloseModal from "../components/modals/BackdropCloseModal.html"

const addOpenAttribute = (htmlString) => {
  return htmlString.replace('<dialog', '<dialog open');
};

export default {
  title: 'Modals',
  parameters: {
    a11y: {
      config: {
      },
    },
  },
};

export const ButtonClose = () => addOpenAttribute(ButtonCloseModal);
ButtonClose.storyName = 'No Backdrop, No Click Away';

export const Backdrop = () => addOpenAttribute(BackdropModal);
Backdrop.storyName = 'Backdrop, No Click Away';

export const ClickAwayClose = () => addOpenAttribute(ClickAwayCloseModal);
ClickAwayClose.storyName = 'No Backdrop, Click Away';

export const BackdropClose = () => addOpenAttribute(BackdropCloseModal);
BackdropClose.storyName = 'Backdrop, Click Away';
