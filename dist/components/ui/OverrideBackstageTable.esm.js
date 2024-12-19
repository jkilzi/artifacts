import React from 'react';
import { Table } from '@backstage/core-components';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  orchestratorTable: {
    "& .Mui-disabled": {
      backgroundColor: "transparent"
    }
  }
});
const OverrideBackstageTable = (props) => {
  const classes = useStyles();
  return /* @__PURE__ */ React.createElement("div", { className: classes.orchestratorTable }, /* @__PURE__ */ React.createElement(
    Table,
    {
      ...props,
      options: { ...props.options, thirdSortClick: false }
    }
  ));
};

export { OverrideBackstageTable as default };
//# sourceMappingURL=OverrideBackstageTable.esm.js.map
