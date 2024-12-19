import React from 'react';
import { Typography } from '@material-ui/core';

const Paragraph = (props) => {
  return /* @__PURE__ */ React.createElement(
    Typography,
    {
      style: { marginTop: "14px", marginBottom: "14px" },
      variant: props.variant ?? "body2",
      component: "p"
    },
    props.children
  );
};

export { Paragraph };
//# sourceMappingURL=Paragraph.esm.js.map
