import BackdropDrawer from '../components/drawer/BackdropDrawer.html';

const addOpenAttribute = (htmlString) => {
  return htmlString.replace('<dialog', '<dialog open');
};

export default {
  title: 'Drawer',
  parameters: {
    a11y: {
      config: {},
    },
  },
};

export const BackdropClick = () => addOpenAttribute(BackdropDrawer);
BackdropClick.storyName = 'Backdrop Click Drawer';
