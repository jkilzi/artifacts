import moment from 'moment';
import { VALUE_UNAVAILABLE } from '../constants.esm.js';

const WorkflowOverviewFormatter = {
  format: (data) => {
    return {
      id: data.workflowId,
      name: data.name ?? VALUE_UNAVAILABLE,
      lastTriggered: data.lastTriggeredMs ? moment(data.lastTriggeredMs).toDate().toLocaleString() : VALUE_UNAVAILABLE,
      lastRunStatus: data.lastRunStatus?.toString() ?? VALUE_UNAVAILABLE,
      lastRunId: data.lastRunId ?? VALUE_UNAVAILABLE,
      category: data.category ?? VALUE_UNAVAILABLE,
      description: data.description ?? VALUE_UNAVAILABLE,
      format: data.format
    };
  }
};

export { WorkflowOverviewFormatter as default };
//# sourceMappingURL=WorkflowOverviewFormatter.esm.js.map
