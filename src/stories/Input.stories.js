import BasicTextInput from '../components/text-input/basicTextInput.html';
import ErrorTextInput from '../components/text-input/errorTextInput.html';
import CustomErrorTextInput from '../components/text-input/customErrorTextInput.html';
import DisabledTextInput from '../components/text-input/disabledTextInput.html';
import ClearTextInput from '../components/text-input/clearTextInput.html';
import BasicTextArea from '../components/text-input/basicTextArea.html';
import ErrorTextArea from '../components/text-input/errorTextArea.html';
import CustomErrorTextArea from '../components/text-input/customErrorTextArea.html';
import DisabledTextArea from '../components/text-input/disabledTextArea.html';

export default {
  title: 'Inputs',
  parameters: {
    a11y: {
      config: {},
    },
  },
};

export const BasicInput = () => BasicTextInput;
BasicInput.storyName = 'Basic Text Input';

export const ErrorInput = () => ErrorTextInput;
ErrorInput.storyName = 'Error Text Input';

export const CustomError = () => CustomErrorTextInput;
CustomError.storyName = 'Custom Error Text Input';

export const DisabledInput = () => DisabledTextInput;
DisabledInput.storyName = 'Disabled Text Input';

export const ClearableInput = () => ClearTextInput;
ClearableInput.storyName = 'Clearable Text Input';

export const BasicArea = () => BasicTextArea;
BasicArea.storyName = 'Basic Text Area';

export const ErrorArea = () => ErrorTextArea;
ErrorArea.storyName = 'Error Text Area';

export const CustomErrorArea = () => CustomErrorTextArea;
CustomErrorArea.storyName = 'Custom Error Text Area';

export const DisabledArea = () => DisabledTextArea;
DisabledArea.storyName = 'Disabled Text Area';
