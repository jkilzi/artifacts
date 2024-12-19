import React from 'react';
import { Select } from '@backstage/core-components';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "baseline",
    "& label + div": {
      marginTop: "0px"
    }
  },
  select: {
    width: "10rem"
  },
  label: {
    color: theme.palette.text.primary,
    fontSize: theme.typography.fontSize,
    paddingRight: "0.5rem",
    fontWeight: "bold"
  }
}));
const ALL_ITEMS = "___all___";
const Selector = ({
  includeAll = true,
  ...otherProps
}) => {
  const styles = useStyles();
  const selectItems = React.useMemo(
    () => includeAll ? [{ label: "All", value: ALL_ITEMS }, ...otherProps.items] : otherProps.items,
    [includeAll, otherProps.items]
  );
  const handleChange = React.useCallback(
    (item) => otherProps.onChange(item),
    [otherProps]
  );
  return /* @__PURE__ */ React.createElement("div", { className: styles.root }, /* @__PURE__ */ React.createElement(Typography, { className: styles.label }, otherProps.label), /* @__PURE__ */ React.createElement("div", { className: styles.select }, /* @__PURE__ */ React.createElement(
    Select,
    {
      onChange: handleChange,
      items: selectItems,
      selected: otherProps.selected,
      margin: "dense",
      label: otherProps.label
    }
  )));
};
Selector.displayName = "Selector";
Selector.AllItems = ALL_ITEMS;

export { Selector };
//# sourceMappingURL=Selector.esm.js.map
