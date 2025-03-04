import Buttons from '../components/buttons/Buttons.html';
import ControlButton from '../components/buttons/ControlButton.html';
import ControlBar from '../components/buttons/ControlBar.html';
import ControlBarVertical from '../components/buttons/ControlBarVertical.html';

export default {
  title: 'Buttons',
  parameters: {
    a11y: {
      config: {},
    },
  },
};

export const ButtonsTest = () => Buttons;
ButtonsTest.storyName = 'Buttons';

export const ControlButtonTest = () => ControlButton;
ControlButtonTest.storyName = 'Control Button';

export const ControlBarTest = () => ControlBar;
ControlBarTest.storyName = 'Control Bar';

export const ControlBarVerticalTest = () => ControlBarVertical;
ControlBarVerticalTest.storyName = 'Control Bar Vertical';
