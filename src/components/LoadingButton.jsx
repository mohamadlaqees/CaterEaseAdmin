import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const LoadingButton = ({
  isButton,
  type,
  btnClass,
  disabled,
  loadingText,
  text,
  spinColor = "",
  variant,
}) => {
  return isButton ? (
    <Button
      type={type}
      className={btnClass}
      disabled={disabled}
      variant={variant}
    >
      {disabled ? (
        <span className="flex items-center gap-1">
          <Loader2 className={`animate-spin ${spinColor}`} /> {loadingText}
        </span>
      ) : (
        text
      )}
    </Button>
  ) : (
    <div type={type} className={btnClass} disabled={disabled}>
      {disabled ? (
        <span className="flex items-center gap-1">
          <Loader2 className={`animate-spin ${spinColor}`} /> {loadingText}
        </span>
      ) : (
        text
      )}
    </div>
  );
};

export default LoadingButton;
