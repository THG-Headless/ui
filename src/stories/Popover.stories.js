import PopoverTop from "../components/popover/PopoverTop.html";
import PopoverBottom from "../components/popover/PopoverBottom.html";

export default {
  title: "Popover",
  parameters: {
    a11y: {
      config: {},
    },
  },
};

export const $PopoverTop = () => PopoverTop;
$PopoverTop.storyName = "Popover Top";

export const $PopoverBottom = () => PopoverBottom;
$PopoverBottom.storyName = "Popover Bottom";
