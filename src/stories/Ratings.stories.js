import StaticRating from '../components/ratings/StaticRating.html';

export default {
  title: 'Rating',
  parameters: {
    a11y: {
      config: {},
    },
  },
};

export const Default = () => StaticRating;
Default.storyName = 'Default Stars';
