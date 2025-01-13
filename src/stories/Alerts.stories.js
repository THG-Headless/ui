import ErrorAlert from "../components/alerts/ErrorAlert.html";
import SuccessAlert from "../components/alerts/SuccessAlert.html";
import InfoAlert from "../components/alerts/InfoAlert.html";

export default {
  title: "Alerts",
  parameters: {
    a11y: {
      config: {},
    },
  },
};

export const Error = () => ErrorAlert;
Error.storyName = "Error Alert";

export const Success = () => SuccessAlert;
Success.storyName = "Success Alert";

export const Info = () => InfoAlert;
Info.storyName = "Info Alert";