import PrimaryButtonHighEmphasis from "../components/buttons/PrimaryButtonHighEmphasis.html";
import PrimaryButtonMediumEmphasis from "../components/buttons/PrimaryButtonMediumEmphasis.html";
import PrimaryButtonLowEmphasis from "../components/buttons/PrimaryButtonLowEmphasis.html";
import SecondaryButtonHighEmphasis from "../components/buttons/SecondaryButtonHighEmphasis.html";
import SecondaryButtonMediumEmphasis from "../components/buttons/SecondaryButtonMediumEmphasis.html";
import SecondaryButtonLowEmphasis from "../components/buttons/SecondaryButtonLowEmphasis.html";
import TertiaryButtonHighEmphasis from "../components/buttons/TertiaryButtonHighEmphasis.html";
import TertiaryButtonMediumEmphasis from "../components/buttons/TertiaryButtonMediumEmphasis.html";
import TertiaryButtonLowEmphasis from "../components/buttons/TertiaryButtonLowEmphasis.html";

export default {
  title: "Buttons",
  parameters: {
    a11y: {
      config: {},
    },
  },
};

export const PrimaryHighEmphasis = () => PrimaryButtonHighEmphasis;
PrimaryHighEmphasis.storyName = "Primary Button - High Emphasis";

export const PrimaryMediumEmphasis = () => PrimaryButtonMediumEmphasis;
PrimaryMediumEmphasis.storyName = "Primary Button - Medium Emphasis";

export const PrimaryLowEmphasis = () => PrimaryButtonLowEmphasis;
PrimaryLowEmphasis.storyName = "Primary Button - Low Emphasis";

export const SecondaryHighEmphasis = () => SecondaryButtonHighEmphasis;
SecondaryHighEmphasis.storyName = "Secondary Button - High Emphasis";

export const SecondaryMediumEmphasis = () => SecondaryButtonMediumEmphasis;
SecondaryMediumEmphasis.storyName = "Secondary Button - Medium Emphasis";

export const SecondaryLowEmphasis = () => SecondaryButtonLowEmphasis;
SecondaryLowEmphasis.storyName = "Secondary Button - Low Emphasis";

export const TertiaryHighEmphasis = () => TertiaryButtonHighEmphasis;
TertiaryHighEmphasis.storyName = "Tertiary Button - High Emphasis";

export const TertiaryMediumEmphasis = () => TertiaryButtonMediumEmphasis;
TertiaryMediumEmphasis.storyName = "Tertiary Button - Medium Emphasis";

export const TertiaryLowEmphasis = () => TertiaryButtonLowEmphasis;
TertiaryLowEmphasis.storyName = "Tertiary Button - Low Emphasis";
