import "reflect-metadata";
import {
  RuntimeModule,
  runtimeMethod,
  state,
  runtimeModule,
} from "@proto-kit/module";
import { StateMap, assert } from "@proto-kit/protocol";

import { Field, Group, Poseidon, Provable, PublicKey, Struct } from "o1js";
import { Balance, Balances, TokenId } from "./example-token";
import { inject } from "tsyringe";

export class PoolSenderTokenPair extends Struct({
  sender: PublicKey,
  tokenId: TokenId,
}) {
  public static from(sender: PublicKey, tokenId: TokenId): PoolSenderTokenPair {
    return new PoolSenderTokenPair({ sender, tokenId });
  }
}

export class PoolKey extends PublicKey {
  public static fromSenderAndTokenIdPair(
    sender: PublicKey,
    tokenInId: TokenId,
  ): PoolKey {
    const poolSenderTokenPair = PoolSenderTokenPair.from(sender, tokenInId);
    const {
      x,
      y: { x0 },
    } = Poseidon.hashToGroup(PoolSenderTokenPair.toFields(poolSenderTokenPair));
    return PoolKey.fromGroup(Group.fromFields([ x, x0 ]));
  }
}

export class BidderPoolPair extends Struct({
  bidder: PublicKey,
  pool: PoolKey,
}) {
  public static from(bidder: PublicKey, pool: PoolKey): BidderPoolPair {
    return new BidderPoolPair({ bidder, pool });
  }
}

export class OrderKey extends PublicKey {
  public static fromBidderAndPoolPair(
    bidder: PublicKey,
    pool: PoolKey,
  ): OrderKey {
    const bidderPoolPair = BidderPoolPair.from(bidder, pool);
    const {
      x,
      y: { x0 },
    } = Poseidon.hashToGroup(BidderPoolPair.toFields(bidderPoolPair));
    return OrderKey.fromGroup(Group.fromFields([ x, x0 ]));
  }
}

export const errors = {
};

@runtimeModule()
export class Escrow extends RuntimeModule<unknown> {
  public static defaultPoolValue = Field(0);
  @state() public pools = StateMap.from<PoolKey, Field>(PoolKey, Field);
  @state() public orders = StateMap.from<OrderKey, Field>(OrderKey, Field);

  public constructor(@inject("Balances") public balances: Balances) {
    super();
  }

  // @runtimeMethod()
  // public createPool(
  //   assetContract: PublicKey,
  //   dueDate: Field,
  // ) {
  //   const creator = this.transaction.sender;
  //   const pool = PoolKey.fromTokenIdPair(tokenInId, tokenOutId);

  //   this.balances.transfer(tokenInId, creator, pool, tokenInAmount);
  //   this.balances.transfer(tokenOutId, creator, pool, tokenOutAmount);

  //   const lpTokenId = LPTokenId.fromTokenIdPair(tokenInId, tokenOutId);
  //   this.balances.mint(lpTokenId, creator, tokenInAmount);
  // }

  // @runtimeMethod()
  // public createOrder() {
  //   const creator = this.transaction.sender;
  //   const order = 
  // }
}
