import ButtonCloseModal from "../components/modals/BasicModal.html";
import BackdropModal from "../components/modals/BackdropOnlyModal.html";
import NoBackdropModal from "../components/modals/NoBackdropModal.html";
import CloseButtonModal from "../components/modals/CloseButtonModal.html";
import ContentModal from "../components/modals/ContentModal.html";
import ActionsModal from "../components/modals/ActionsModal.html";
import HeroModal from "../components/modals/HeroModal.html";
import ComplexModal from "../components/modals/ComplexModal.html";

const addOpenAttribute = (htmlString) => {
  return htmlString.replace("<dialog", "<dialog open");
};

export default {
  title: "Modals",
  parameters: {
    a11y: {
      config: {},
    },
  },
};

export const Basic = () => addOpenAttribute(ButtonCloseModal);
Basic.storyName = "Basic Modal";

export const BackdropOnly = () => addOpenAttribute(BackdropModal);
BackdropOnly.storyName = "Backdrop Click Away";

export const NoBackdrop = () => addOpenAttribute(NoBackdropModal);
NoBackdrop.storyName = "No Backdrop";

export const CloseButton = () => addOpenAttribute(CloseButtonModal);
CloseButton.storyName = "Close Button";

export const Content = () => addOpenAttribute(ContentModal);
Content.storyName = "Content Structure";

export const Actions = () => addOpenAttribute(ActionsModal);
Actions.storyName = "Action Buttons";

export const Hero = () => addOpenAttribute(HeroModal);
Hero.storyName = "Hero Image";

export const Complex = () => addOpenAttribute(ComplexModal);
Complex.storyName = "Complex Modal";
