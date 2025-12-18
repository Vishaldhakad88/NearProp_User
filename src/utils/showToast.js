// utils/showToast.js
import { toast } from "react-toastify";

export const showToast = (message, type = "info") => {
  const options = {
    position: "top-right",
    autoClose: 3000,       // auto close after 3s
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    case "warn":
      toast.warn(message, options);
      break;
    default:
      toast.info(message, options);
  }
};
