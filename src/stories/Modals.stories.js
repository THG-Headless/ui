import ButtonCloseModal from "../components/modals/ButtonCloseModal.html"
import BackdropModal from "../components/modals/BackdropModal.html"
import ClickAwayCloseModal from "../components/modals/ClickAwayCloseModal.html"
import BackdropCloseModal from "../components/modals/BackdropCloseModal.html"

export default {
  title: 'Modals',
  parameters: {
    a11y: {
      // Enable all WCAG rules
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true
          },
          {
            id: 'button-name',
            enabled: true
          }
        ]
      },
      // Test the entire document
      element: '#storybook-root',
      options: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
        }
      }
    },
  },
  decorators: [
    (Story) => {
      // Open modal after story renders
      setTimeout(() => {
        const modalId = Story().getAttribute('data-modal-id');
        const dialog = document.getElementById(modalId);
        if (dialog) {
          dialog.showModal();
          // Force accessibility check after modal opens
          const axeCore = window.axe;
          if (axeCore) {
            axeCore.reset();
            axeCore.run();
          }
        }
      }, 100);
      return Story();
    }
  ]
};

export const ButtonClose = () => {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('data-modal-id', 'modal1');
  wrapper.innerHTML = ButtonCloseModal;
  return wrapper;
};
ButtonClose.storyName = 'No Backdrop, No Click Away';

export const Backdrop = () => {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('data-modal-id', 'modal2');
  wrapper.innerHTML = BackdropModal;
  return wrapper;
};
Backdrop.storyName = 'Backdrop, No Click Away';

export const ClickAwayClose = () => {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('data-modal-id', 'modal3');
  wrapper.innerHTML = ClickAwayCloseModal;
  return wrapper;
};
ClickAwayClose.storyName = 'No Backdrop, Click Away';

export const BackdropClose = () => {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('data-modal-id', 'modal4');
  wrapper.innerHTML = BackdropCloseModal;
  return wrapper;
};
BackdropClose.storyName = 'Backdrop, Click Away';
