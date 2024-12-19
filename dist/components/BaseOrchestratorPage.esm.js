import React from 'react';
import { Page, Header, Content } from '@backstage/core-components';

const BaseOrchestratorPage = ({
  title,
  subtitle,
  type,
  typeLink,
  noPadding,
  children
}) => {
  return /* @__PURE__ */ React.createElement(Page, { themeId: "tool" }, /* @__PURE__ */ React.createElement(
    Header,
    {
      title,
      subtitle,
      type,
      typeLink
    }
  ), /* @__PURE__ */ React.createElement(Content, { noPadding }, children));
};

export { BaseOrchestratorPage };
//# sourceMappingURL=BaseOrchestratorPage.esm.js.map
