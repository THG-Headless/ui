import AccentButton from '../components/buttons/AccentButton.html';
import PrimaryButton from '../components/buttons/PrimaryButton.html';
import SecondaryButton from '../components/buttons/SecondaryButton.html';
import StatusButtons from '../components/buttons/StatusButtons.html';

import "@thg-altitude/standalone-components-css";

export default {
  title: 'Buttons',
  parameters: {
    a11y: {
      config: {
      },
    },
  },
};

export const Primary = () => PrimaryButton;
Primary.storyName = 'Primary Button';

export const Secondary = () => SecondaryButton;
Secondary.storyName = 'Secondary Button';

export const Accent = () => AccentButton;
Accent.storyName = 'Accent Button';

export const Status = () => StatusButtons;
Status.storyName = 'Status Buttons';
