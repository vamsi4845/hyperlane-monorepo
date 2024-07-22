import { expect } from 'chai';

import { hyperlaneContextAgentChainConfig as mainnet3AgentChainConfig } from '../config/environments/mainnet3/agent.js';
import { mainnet3SupportedChainNames } from '../config/environments/mainnet3/supportedChainNames.js';
import { hyperlaneContextAgentChainConfig as testnet4AgentChainConfig } from '../config/environments/testnet4/agent.js';
import { testnet4SupportedChainNames } from '../config/environments/testnet4/supportedChainNames.js';
import { getAgentConfigJsonPath } from '../scripts/agent-utils.js';
import {
  AgentChainConfig,
  ensureAgentChainConfigIncludesAllChainNames,
} from '../src/config/agent/agent.js';
import { AgentEnvironment } from '../src/config/environment.js';
import { readJSONAtPath } from '../src/utils/utils.js';

const environmentChainConfigs = {
  mainnet3: {
    agentChainConfig: mainnet3AgentChainConfig,
    // We read the agent config from the file system instead of importing
    // to get around the agent JSON configs living outside the typescript rootDir
    agentJsonConfig: readJSONAtPath(
      getAgentConfigJsonPath(AgentEnvironment.Mainnet),
    ),
    supportedChainNames: mainnet3SupportedChainNames,
  },
  testnet4: {
    agentChainConfig: testnet4AgentChainConfig,
    agentJsonConfig: readJSONAtPath(
      getAgentConfigJsonPath(AgentEnvironment.Testnet),
    ),
    supportedChainNames: testnet4SupportedChainNames,
  },
};

describe('Agent configs', () => {
  Object.entries(environmentChainConfigs).forEach(([environment, config]) => {
    describe(`Environment: ${environment}`, () => {
      it('AgentChainConfig specifies all chains for each role in the agent chain config', () => {
        // This will throw if there are any inconsistencies
        ensureAgentChainConfigIncludesAllChainNames(
          config.agentChainConfig as AgentChainConfig<
            typeof config.supportedChainNames
          >,
          config.supportedChainNames,
        );
      });

      it('Agent JSON config matches environment chains', () => {
        const agentJsonConfigChains = Object.keys(
          config.agentJsonConfig.chains,
        );
        // Allow for the agent JSON config to be a superset of the supported
        // chain names, as AW may not always run agents for all chains.
        expect(agentJsonConfigChains).to.include.members(
          config.supportedChainNames,
        );
      });
    });
  });
});
