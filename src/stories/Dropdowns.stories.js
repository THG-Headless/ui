import BasicDropdown from '../components/dropdown/BasicDropdown.html';
import BasicDropdownOpen from '../components/dropdown/BasicDropdownOpen.html';
import ErrorDropdown from '../components/dropdown/ErrorDropdown.html';
import InactiveDropdown from '../components/dropdown/InactiveDropdown.html';
import SearchDropdown from '../components/dropdown/SearchDropdown.html';
import SearchDropdownOpen from '../components/dropdown/SearchDropdownOpen.html';

export default {
  title: 'Dropdowns',
  parameters: {
    a11y: {
      config: {},
    },
  },
};

export const Basic = () => BasicDropdown;
Basic.storyName = 'Basic Dropdown';

export const BasicOpen = () => BasicDropdownOpen;
BasicOpen.storyName = 'Basic Dropdown, Open';

export const Error = () => ErrorDropdown;
Error.storyName = 'Error Dropdown';

export const Inactive = () => InactiveDropdown;
Inactive.storyName = 'Inactive Dropdown';

export const Search = () => SearchDropdown;
Search.storyName = 'Search Dropdown';

export const SearchOpen = () => SearchDropdownOpen;
SearchOpen.storyName = 'Search Dropdown';
