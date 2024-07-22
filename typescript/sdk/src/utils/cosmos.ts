import { z } from 'zod';

// Generated from https://github.com/cosmos/chain-registry/blob/master/chain.schema.json
// using https://stefanterdell.github.io/json-schema-to-zod-react/
export const CosmosChainSchema = z
  .object({
    $schema: z
      .string()
      .regex(new RegExp('^(\\.\\./)+chain\\.schema\\.json$'))
      .optional(),
    chain_name: z.string().regex(new RegExp('[a-z0-9]+')),
    chain_id: z.string(),
    pre_fork_chain_name: z.string().regex(new RegExp('[a-z0-9]+')).optional(),
    pretty_name: z.string().optional(),
    website: z.string().url().optional(),
    update_link: z.string().url().optional(),
    status: z.enum(['live', 'upcoming', 'killed']).optional(),
    network_type: z.enum(['mainnet', 'testnet', 'devnet']).optional(),
    bech32_prefix: z
      .string()
      .describe(
        "The default prefix for the human-readable part of addresses that identifies the coin type. Must be registered with SLIP-0173. E.g., 'cosmos'",
      ),
    bech32_config: z
      .object({
        bech32PrefixAccAddr: z.string().describe("e.g., 'cosmos'").optional(),
        bech32PrefixAccPub: z.string().describe("e.g., 'cosmospub'").optional(),
        bech32PrefixValAddr: z
          .string()
          .describe("e.g., 'cosmosvaloper'")
          .optional(),
        bech32PrefixValPub: z
          .string()
          .describe("e.g., 'cosmosvaloperpub'")
          .optional(),
        bech32PrefixConsAddr: z
          .string()
          .describe("e.g., 'cosmosvalcons'")
          .optional(),
        bech32PrefixConsPub: z
          .string()
          .describe("e.g., 'cosmosvalconspub'")
          .optional(),
      })
      .strict()
      .describe('Used to override the bech32_prefix for specific uses.')
      .optional(),
    daemon_name: z.string().optional(),
    node_home: z.string().optional(),
    key_algos: z
      .array(
        z.enum(['secp256k1', 'ethsecp256k1', 'ed25519', 'sr25519', 'bn254']),
      )
      .optional(),
    slip44: z.number().optional(),
    alternative_slip44s: z.array(z.number()).optional(),
    fees: z
      .object({
        fee_tokens: z.array(
          z
            .object({
              denom: z.string(),
              fixed_min_gas_price: z.number().optional(),
              low_gas_price: z.number().optional(),
              average_gas_price: z.number().optional(),
              high_gas_price: z.number().optional(),
              gas_costs: z
                .object({
                  cosmos_send: z.number().optional(),
                  ibc_transfer: z.number().optional(),
                })
                .strict()
                .optional(),
            })
            .strict(),
        ),
      })
      .strict()
      .optional(),
    staking: z
      .object({
        staking_tokens: z.array(z.object({ denom: z.string() }).strict()),
        lock_duration: z
          .object({
            blocks: z
              .number()
              .describe(
                'The number of blocks for which the staked tokens are locked.',
              )
              .optional(),
            time: z
              .string()
              .describe(
                'The approximate time for which the staked tokens are locked.',
              )
              .optional(),
          })
          .strict()
          .optional(),
      })
      .strict()
      .optional(),
    codebase: z
      .object({
        git_repo: z.string().url().optional(),
        recommended_version: z.string().optional(),
        go_version: z
          .string()
          .regex(new RegExp('^[0-9]+\\.[0-9]+(\\.[0-9]+)?$'))
          .describe('Minimum accepted go version to build the binary.')
          .optional(),
        compatible_versions: z.array(z.string()).optional(),
        binaries: z
          .object({
            'linux/amd64': z.string().url().optional(),
            'linux/arm64': z.string().url().optional(),
            'darwin/amd64': z.string().url().optional(),
            'darwin/arm64': z.string().url().optional(),
            'windows/amd64': z.string().url().optional(),
            'windows/arm64': z.string().url().optional(),
          })
          .strict()
          .optional(),
        cosmos_sdk_version: z.string().optional(),
        consensus: z
          .object({
            type: z.enum(['tendermint', 'cometbft', 'sei-tendermint']),
            version: z.string().optional(),
          })
          .strict()
          .optional(),
        cosmwasm_version: z.string().optional(),
        cosmwasm_enabled: z.boolean().optional(),
        cosmwasm_path: z
          .string()
          .regex(new RegExp('^\\$HOME.*$'))
          .describe(
            'Relative path to the cosmwasm directory. ex. $HOME/.juno/data/wasm',
          )
          .optional(),
        ibc_go_version: z.string().optional(),
        ics_enabled: z
          .array(
            z
              .enum(['ics20-1', 'ics27-1', 'mauth'])
              .describe('IBC app or ICS standard.'),
          )
          .describe(
            'List of IBC apps (usually corresponding to a ICS standard) which have been enabled on the network.',
          )
          .optional(),
        genesis: z
          .object({
            name: z.string().optional(),
            genesis_url: z.string().url(),
            ics_ccv_url: z.string().url().optional(),
          })
          .strict()
          .optional(),
        versions: z
          .array(
            z
              .object({
                name: z.string().describe('Official Upgrade Name'),
                tag: z.string().describe('Git Upgrade Tag').optional(),
                height: z.number().describe('Block Height').optional(),
                proposal: z
                  .number()
                  .describe(
                    'Proposal that will officially signal community acceptance of the upgrade.',
                  )
                  .optional(),
                previous_version_name: z
                  .string()
                  .describe('[Optional] Name of the previous version')
                  .optional(),
                next_version_name: z
                  .string()
                  .describe('[Optional] Name of the following version')
                  .optional(),
                recommended_version: z.string().optional(),
                go_version: z
                  .string()
                  .regex(new RegExp('^[0-9]+\\.[0-9]+(\\.[0-9]+)?$'))
                  .describe('Minimum accepted go version to build the binary.')
                  .optional(),
                compatible_versions: z.array(z.string()).optional(),
                cosmos_sdk_version: z.string().optional(),
                consensus: z
                  .object({
                    type: z.enum(['tendermint', 'cometbft', 'sei-tendermint']),
                    version: z.string().optional(),
                  })
                  .strict()
                  .optional(),
                cosmwasm_version: z.string().optional(),
                cosmwasm_enabled: z.boolean().optional(),
                cosmwasm_path: z
                  .string()
                  .regex(new RegExp('^\\$HOME.*$'))
                  .describe(
                    'Relative path to the cosmwasm directory. ex. $HOME/.juno/data/wasm',
                  )
                  .optional(),
                ibc_go_version: z.string().optional(),
                ics_enabled: z
                  .array(
                    z
                      .enum(['ics20-1', 'ics27-1', 'mauth'])
                      .describe('IBC app or ICS standard.'),
                  )
                  .describe(
                    'List of IBC apps (usually corresponding to a ICS standard) which have been enabled on the network.',
                  )
                  .optional(),
                binaries: z
                  .object({
                    'linux/amd64': z.string().url().optional(),
                    'linux/arm64': z.string().url().optional(),
                    'darwin/amd64': z.string().url().optional(),
                    'darwin/arm64': z.string().url().optional(),
                    'windows/amd64': z.string().url().optional(),
                    'windows/arm64': z.string().url().optional(),
                  })
                  .strict()
                  .optional(),
              })
              .strict(),
          )
          .optional(),
      })
      .strict()
      .optional(),
    images: z
      .array(
        z
          .object({
            image_sync: z
              .object({
                chain_name: z
                  .string()
                  .describe(
                    "The chain name or platform from which the object resides. E.g., 'cosmoshub', 'ethereum', 'forex', or 'nasdaq'",
                  ),
                base_denom: z
                  .string()
                  .describe(
                    "The base denom of the asset from which the object originates. E.g., when describing ATOM from Cosmos Hub, specify 'uatom', NOT 'atom' nor 'ATOM'; base units are unique per platform.",
                  )
                  .optional(),
              })
              .strict()
              .describe(
                'The (primary) key used to identify an object within the Chain Registry.',
              )
              .optional(),
            png: z
              .string()
              .regex(
                new RegExp(
                  '^https://raw\\.githubusercontent\\.com/cosmos/chain-registry/master/(|testnets/|_non-cosmos/)[a-z0-9]+/images/.+\\.png$',
                ),
              )
              .optional(),
            svg: z
              .string()
              .regex(
                new RegExp(
                  '^https://raw\\.githubusercontent\\.com/cosmos/chain-registry/master/(|testnets/|_non-cosmos/)[a-z0-9]+/images/.+\\.svg$',
                ),
              )
              .optional(),
            theme: z
              .object({
                primary_color_hex: z
                  .string()
                  .min(1)
                  .regex(new RegExp('^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$'))
                  .optional(),
                background_color_hex: z
                  .string()
                  .min(1)
                  .regex(
                    new RegExp('^(#([0-9a-fA-F]{6}|[0-9a-fA-F]{8})|none)$'),
                  )
                  .optional(),
                circle: z.boolean().optional(),
                dark_mode: z.boolean().optional(),
              })
              .strict()
              .optional(),
            layout: z
              .enum(['logo', 'logomark', 'logotype'])
              .describe(
                'logomark == icon only; logotype == text only; logo == icon + text.',
              )
              .optional(),
            text_position: z
              .enum(['top', 'bottom', 'left', 'right', 'integrated'])
              .describe(
                "Indicates in which position the text is placed, in case the layout is 'icon' type, it's required only in this case.",
              )
              .optional(),
          })
          .strict()
          .and(z.union([z.any(), z.any()])),
      )
      .optional(),
    logo_URIs: z
      .object({
        png: z
          .string()
          .regex(
            new RegExp(
              '^https://raw\\.githubusercontent\\.com/cosmos/chain-registry/master/(|testnets/|_non-cosmos/)[a-z0-9]+/images/.+\\.png$',
            ),
          )
          .optional(),
        svg: z
          .string()
          .regex(
            new RegExp(
              '^https://raw\\.githubusercontent\\.com/cosmos/chain-registry/master/(|testnets/|_non-cosmos/)[a-z0-9]+/images/.+\\.svg$',
            ),
          )
          .optional(),
      })
      .strict()
      .optional(),
    description: z.string().max(3000).optional(),
    peers: z
      .object({
        seeds: z
          .array(
            z
              .object({
                id: z.string(),
                address: z.string(),
                provider: z.string().optional(),
              })
              .strict(),
          )
          .optional(),
        persistent_peers: z
          .array(
            z
              .object({
                id: z.string(),
                address: z.string(),
                provider: z.string().optional(),
              })
              .strict(),
          )
          .optional(),
      })
      .strict()
      .optional(),
    apis: z
      .object({
        rpc: z
          .array(
            z
              .object({
                address: z.string(),
                provider: z.string().optional(),
                archive: z.boolean().default(false),
              })
              .strict(),
          )
          .optional(),
        rest: z
          .array(
            z
              .object({
                address: z.string(),
                provider: z.string().optional(),
                archive: z.boolean().default(false),
              })
              .strict(),
          )
          .optional(),
        grpc: z
          .array(
            z
              .object({
                address: z.string(),
                provider: z.string().optional(),
                archive: z.boolean().default(false),
              })
              .strict(),
          )
          .optional(),
        wss: z
          .array(
            z
              .object({
                address: z.string(),
                provider: z.string().optional(),
                archive: z.boolean().default(false),
              })
              .strict(),
          )
          .optional(),
        'grpc-web': z
          .array(
            z
              .object({
                address: z.string(),
                provider: z.string().optional(),
                archive: z.boolean().default(false),
              })
              .strict(),
          )
          .optional(),
        'evm-http-jsonrpc': z
          .array(
            z
              .object({
                address: z.string(),
                provider: z.string().optional(),
                archive: z.boolean().default(false),
              })
              .strict(),
          )
          .optional(),
      })
      .strict()
      .optional(),
    explorers: z
      .array(
        z
          .object({
            kind: z.string().optional(),
            url: z.string().optional(),
            tx_page: z.string().optional(),
            account_page: z.string().optional(),
          })
          .strict(),
      )
      .optional(),
    keywords: z.array(z.string()).optional(),
    extra_codecs: z.array(z.enum(['ethermint', 'injective'])).optional(),
  })
  .strict()
  .describe(
    'Cosmos Chain.json is a metadata file that contains information about a cosmos sdk based chain.',
  );

export async function getCosmosRegistryChain(chain: string) {
  const json = await fetch(
    `https://raw.githubusercontent.com/cosmos/chain-registry/master/${chain}/chain.json`,
  );
  const data = await json.json();
  const result = CosmosChainSchema.safeParse(data);
  if (!result.success) {
    const errorMessages = result.error.issues.map(
      (issue: any) => `${issue.path} => ${issue.message}`,
    );
    throw new Error(`Invalid Cosmos chain:\n ${errorMessages.join('\n')}`);
  }
  return result.data;
}
