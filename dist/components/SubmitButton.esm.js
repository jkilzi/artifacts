import React from 'react';
import { Button, CircularProgress } from '@material-ui/core';

const SubmitButton = ({
  submitting,
  handleClick,
  children,
  focusOnMount
}) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (focusOnMount) {
      ref.current?.focus();
    }
  }, [focusOnMount]);
  return /* @__PURE__ */ React.createElement(
    Button,
    {
      ref,
      variant: "contained",
      color: "primary",
      onClick: handleClick,
      disabled: submitting,
      type: "submit",
      startIcon: submitting ? /* @__PURE__ */ React.createElement(CircularProgress, { size: "1rem" }) : null,
      disableRipple: true
    },
    children
  );
};

export { SubmitButton as default };
//# sourceMappingURL=SubmitButton.esm.js.map
