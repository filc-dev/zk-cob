/* eslint-disable import/no-unused-modules */
/* eslint-disable max-classes-per-file */
import {
  EventEmitter,
  EventEmittingComponent,
  EventsRecord,
  NoConfig,
} from "@proto-kit/common";
import {
  RuntimeModule,
  runtimeMethod,
  state,
  runtimeModule,
} from "@proto-kit/module";
import { StateMap, assert } from "@proto-kit/protocol";
import {
  Field,
  PublicKey,
  Struct,
  SmartContract,
  AccountUpdate,
  DeployArgs,
  Bool,
} from "o1js";
import { UInt64 } from "@proto-kit/library";

// declare abstract class ERC1155TokenContract extends SmartContract {
//   /**
//    * Deploys a {@link TokenContract}.
//    *
//    * In addition to base smart contract deployment, this adds two steps:
//    * - set the `access` permission to `proofOrSignature()`, to prevent against unauthorized token operations
//    *   - not doing this would imply that anyone can bypass token contract authorization and simply mint themselves tokens
//    * - require the zkapp account to be new, using the `isNew` precondition.
//    *   this guarantees that the access permission is set from the very start of the existence of this account.
//    *   creating the zkapp account before deployment would otherwise be a security vulnerability that is too easy to introduce.
//    *
//    * Note that because of the `isNew` precondition, the zkapp account must not be created prior to calling `deploy()`.
//    *
//    * If the contract needs to be re-deployed, you can switch off this behaviour by overriding the `isNew` precondition:
//    * ```ts
//    * deploy() {
//    *   super.deploy();
//    *   // DON'T DO THIS ON THE INITIAL DEPLOYMENT!
//    *   this.account.isNew.requireNothing();
//    * }
//    * ```
//    */
//   deploy(args?: DeployArgs): void;
//   /**
//    * Helper methods to use from within a token contract.
//    */
//   get internal(): {
//     mint({
//       address,
//       tokenId,
//       amount,
//     }: {
//       address: PublicKey | AccountUpdate | SmartContract;
//       tokenId: number | bigint | UInt64;
//       amount: number | bigint | UInt64;
//     }): AccountUpdate;
//     burn({
//       address,
//       tokenId,
//       amount,
//     }: {
//       address: PublicKey | AccountUpdate | SmartContract;
//       tokenId: number | bigint | UInt64;
//       amount: number | bigint | UInt64;
//     }): AccountUpdate;
//     send({
//       from,
//       to,
//       tokenId,
//       amount,
//     }: {
//       from: PublicKey | AccountUpdate | SmartContract;
//       to: PublicKey | AccountUpdate | SmartContract;
//       tokenId: number | bigint | UInt64;
//       amount: number | bigint | UInt64;
//     }): AccountUpdate;
//   };
//   abstract approveBase(forest: AccountUpdateForest): void;
//   /**
//    * Iterate through the account updates in `updates` and apply `callback` to each.
//    *
//    * This method is provable and is suitable as a base for implementing `approveUpdates()`.
//    */
//   forEachUpdate(
//     updates: AccountUpdateForest,
//     callback: (update: AccountUpdate, usesToken: Bool) => void
//   ): void;
//   /**
//    * Use `forEachUpdate()` to prove that the total balance change of child account updates is zero.
//    *
//    * This is provided out of the box as it is both a good example, and probably the most common implementation, of `approveBase()`.
//    */
//   checkZeroBalanceChange(updates: AccountUpdateForest): void;
//   /**
//    * Approve a single account update (with arbitrarily many children).
//    */
//   approveAccountUpdate(accountUpdate: AccountUpdate | AccountUpdateTree): void;
//   /**
//    * Approve a list of account updates (with arbitrarily many children).
//    */
//   approveAccountUpdates(
//     accountUpdates: (AccountUpdate | AccountUpdateTree)[]
//   ): void;
//   /**
//    * Transfer `amount` of tokens with `tokenId` from `from` to `to`.
//    */
//   transfer(
//     from: PublicKey | AccountUpdate,
//     to: PublicKey | AccountUpdate,
//     tokenId: UInt64 | number | bigint,
//     amount: UInt64 | number | bigint
//   ): void;
//   /**
//    * URI for the token metadata.
//    * @param tokenId The token ID.
//    * @returns The URI.
//    */
//   uri(tokenId: UInt64 | number | bigint): string;
// }

export const errors = {
  senderNotFrom: () => "Sender does not match 'from'",
  fromBalanceInsufficient: () => "From balance is insufficient",
};

export class TokenId extends Field {}

export class BalancesKey extends Struct({
  tokenId: TokenId,
  address: PublicKey,
}) {
  public static from(
    tokenId: TokenId,
    address: PublicKey | AccountUpdate | SmartContract
  ) {
    if (address instanceof AccountUpdate) {
      return new BalancesKey({ tokenId, address: address.publicKey });
    }
    if (address instanceof SmartContract) {
      return new BalancesKey({ tokenId, address: address.address });
    }
    return new BalancesKey({ tokenId, address });
  }
}

export class Balance extends UInt64 {}

export interface BalancesEvents extends EventsRecord {
  mint: [TokenId, PublicKey, Balance];
  burn: [TokenId, PublicKey, Balance];
  transfer: [TokenId, PublicKey, PublicKey, Balance];
}

export type MinimalToken = {
  balances: StateMap<BalancesKey, Balance>;
  transfer: (
    tokenId: TokenId,
    from: PublicKey,
    to: PublicKey,
    amount: Balance
  ) => void;
};

@runtimeModule()
export class Balances<Config = NoConfig> extends RuntimeModule<Config> {
  @state() public balances = StateMap.from<BalancesKey, Balance>(
    BalancesKey,
    Balance
  );

  public getBalance(tokenId: TokenId, address: PublicKey): Balance {
    const key = new BalancesKey({ tokenId, address });
    const balanceOption = this.balances.get(key);
    const balance = Balance.from(balanceOption.value.value);
    return balance;
  }

  public setBalance(tokenId: TokenId, address: PublicKey, amount: Balance) {
    const key = new BalancesKey({ tokenId, address });
    this.balances.set(key, amount);
  }

  public transfer(
    from: PublicKey,
    to: PublicKey,
    tokenId: TokenId,
    amount: Balance
  ) {
    const fromBalance = this.getBalance(tokenId, from);
    const toBalance = this.getBalance(tokenId, to);

    const fromBalanceIsSufficient = fromBalance.greaterThanOrEqual(amount);

    assert(fromBalanceIsSufficient, errors.fromBalanceInsufficient());

    const newFromBalance = fromBalance.sub(amount);
    const newToBalance = toBalance.add(amount);

    this.setBalance(tokenId, from, newFromBalance);
    this.setBalance(tokenId, to, newToBalance);
  }

  public mint(address: PublicKey, tokenId: TokenId, amount: Balance) {
    const balance = this.getBalance(tokenId, address);
    const newBalance = balance.add(amount);
    this.setBalance(tokenId, address, newBalance);
  }

  public burn(address: PublicKey, tokenId: TokenId, amount: Balance) {
    const balance = this.getBalance(tokenId, address);
    const newBalance = balance.sub(amount);
    this.setBalance(tokenId, address, newBalance);
  }

  @runtimeMethod()
  public transferSigned(
    from: PublicKey,
    to: PublicKey,
    tokenId: TokenId,
    amount: Balance
  ) {
    assert(this.transaction.sender.value.equals(from), errors.senderNotFrom());

    this.transfer(from, to, tokenId, amount);
  }
}
