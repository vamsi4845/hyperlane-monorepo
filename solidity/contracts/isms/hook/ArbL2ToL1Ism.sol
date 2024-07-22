// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity >=0.8.0;

/*@@@@@@@       @@@@@@@@@
 @@@@@@@@@       @@@@@@@@@
  @@@@@@@@@       @@@@@@@@@
   @@@@@@@@@       @@@@@@@@@
    @@@@@@@@@@@@@@@@@@@@@@@@@
     @@@@@  HYPERLANE  @@@@@@@
    @@@@@@@@@@@@@@@@@@@@@@@@@
   @@@@@@@@@       @@@@@@@@@
  @@@@@@@@@       @@@@@@@@@
 @@@@@@@@@       @@@@@@@@@
@@@@@@@@@       @@@@@@@@*/

// ============ Internal Imports ============

import {IInterchainSecurityModule} from "../../interfaces/IInterchainSecurityModule.sol";
import {TypeCasts} from "../../libs/TypeCasts.sol";
import {Message} from "../../libs/Message.sol";
import {AbstractMessageIdAuthorizedIsm} from "./AbstractMessageIdAuthorizedIsm.sol";

// ============ External Imports ============

import {IOutbox} from "@arbitrum/nitro-contracts/src/bridge/IOutbox.sol";
import {CrossChainEnabledArbitrumL1} from "@openzeppelin/contracts/crosschain/arbitrum/CrossChainEnabledArbitrumL1.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";

/**
 * @title ArbL2ToL1Ism
 * @notice Uses the native Arbitrum bridge to verify interchain messages from L2 to L1.
 */
contract ArbL2ToL1Ism is
    CrossChainEnabledArbitrumL1,
    AbstractMessageIdAuthorizedIsm
{
    using Message for bytes;
    // ============ Constants ============

    // module type for the ISM
    uint8 public constant moduleType =
        uint8(IInterchainSecurityModule.Types.ARB_L2_TO_L1);
    // arbitrum nitro contract on L1 to forward verification
    IOutbox public arbOutbox;

    // ============ Constructor ============

    constructor(
        address _bridge,
        address _outbox
    ) CrossChainEnabledArbitrumL1(_bridge) {
        require(
            Address.isContract(_bridge),
            "ArbL2ToL1Ism: invalid Arbitrum Bridge"
        );
        arbOutbox = IOutbox(_outbox);
    }

    // ============ External Functions ============

    /// @inheritdoc IInterchainSecurityModule
    function verify(
        bytes calldata metadata,
        bytes calldata message
    ) external override returns (bool) {
        bool verified = isVerified(message);
        if (verified) {
            releaseValueToRecipient(message);
        }
        return verified || _verifyWithOutboxCall(metadata, message);
    }

    // ============ Internal function ============

    /**
     * @notice Verify message directly using the arbOutbox.executeTransaction function.
     * @dev This is a fallback in case the message is not verified by the stateful verify function first.
     * @dev This function doesn't support msg.value as the ism.verify call doesn't support it either.
     */
    function _verifyWithOutboxCall(
        bytes calldata metadata,
        bytes calldata message
    ) internal returns (bool) {
        (
            bytes32[] memory proof,
            uint256 index,
            address l2Sender,
            address to,
            uint256 l2Block,
            uint256 l1Block,
            uint256 l2Timestamp,
            bytes memory data
        ) = abi.decode(
                metadata,
                (
                    bytes32[],
                    uint256,
                    address,
                    address,
                    uint256,
                    uint256,
                    uint256,
                    bytes
                )
            );

        // check if the sender of the l2 message is the authorized hook
        require(
            l2Sender == TypeCasts.bytes32ToAddress(authorizedHook),
            "ArbL2ToL1Ism: l2Sender != authorizedHook"
        );
        // this data is an abi encoded call of verifyMessageId(bytes32 messageId)
        require(data.length == 36, "ArbL2ToL1Ism: invalid data length");
        bytes32 messageId = message.id();
        bytes32 convertedBytes;
        assembly {
            // data = 0x[4 bytes function signature][32 bytes messageId]
            convertedBytes := mload(add(data, 36))
        }
        // check if the parsed message id matches the message id of the message
        require(
            convertedBytes == messageId,
            "ArbL2ToL1Ism: invalid message id"
        );

        // value send to 0
        arbOutbox.executeTransaction(
            proof,
            index,
            l2Sender,
            to,
            l2Block,
            l1Block,
            l2Timestamp,
            0,
            data
        );
        // the above bridge call will revert if the verifyMessageId call fails
        return true;
    }

    /// @inheritdoc AbstractMessageIdAuthorizedIsm
    function _isAuthorized() internal view override returns (bool) {
        return
            _crossChainSender() == TypeCasts.bytes32ToAddress(authorizedHook);
    }
}
