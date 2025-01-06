import BasicAccordion from '../components/accordion/BasicAccordion.html';
import SummaryAccordion from '../components/accordion/SummaryAccordion.html';
import NamedSummaryAccordion from '../components/accordion/NamedSummaryAccordion.html';


export default {
  title: 'Accordion',
  parameters: {
    a11y: {
      config: {
      },
    },
  },
};

export const Basic = () => BasicAccordion;
Basic.storyName = 'Basic Accordion';

export const Summary = () => SummaryAccordion;
Summary.storyName = 'Ungrouped Accordion';

export const NamedSummary = () => NamedSummaryAccordion;
NamedSummary.storyName = 'Grouped Accordion';
