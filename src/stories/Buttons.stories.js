// import '../tailwind.css'

import PrimaryButton from '../components/buttons/PrimaryButton.html';
import SecondaryButton from '../components/buttons/SecondaryButton.html';
import TertiaryButton from '../components/buttons/TertiaryButton.html';
import StatusButtons from '../components/buttons/StatusButtons.html';

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

export const Tertiary = () => TertiaryButton;
Tertiary.storyName = 'Tertiary Button';

export const Status = () => StatusButtons;
Status.storyName = 'Status Buttons';
