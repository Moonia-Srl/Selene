import { ApiProperty } from '@nestjsx/crud/lib/crud';
import { Base } from 'src/shared/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Contract } from '../contract/contract.entity';
import { User } from '../user/user.entity';

class Metadata {
  @ApiProperty() type: string;
  @ApiProperty() value: string;
}

@Entity('nfts')
export class NFT extends Base {
  @ApiProperty() @PrimaryColumn() tokenId: string;

  @ApiProperty() @Column() name: string;
  @ApiProperty() @Column() supply: number;
  @ApiProperty() @Column() assetUrl: string;

  @ApiProperty({ type: () => Metadata, isArray: true })
  @Column({ type: 'jsonb', default: () => "'[]'", nullable: false })
  metadata: Metadata[];

  @ApiProperty({ type: () => Contract })
  @ManyToOne(() => Contract, contract => contract.nft)
  @JoinColumn({ name: 'contract_address' })
  contract: Contract;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, user => user.wallet, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'owner_wallet' })
  owner?: User;

  @Column()
  owner_wallet: string;

  /**
   * Returns a linear object (depth=1) in which both the top-level key-value
   * and the nested object have been prefixed with the top-level key name.
   * @method @throws
   * @returns {Record<string, unknown>} - The flat and prefixed object
   */
  public LinearObject(): Record<string, unknown> {
    // Destructure the nested objects from the top-level ones
    const { contract, owner, ...others } = this;

    // Inline function that prefixes each key in the object with a specified string
    const prefixKeys = <T>(object: T, prefix: string) => {
      const entries = Object.entries(object);
      const prefixedEntries = entries.map(([k, v]) => [`${prefix}.${k}`, v]);
      return Object.fromEntries(prefixedEntries);
    };

    // Returns the fully-prefixed and "flat" object
    return {
      ...prefixKeys(others, 'nft'),
      // owner field isn't always available and must be explicitly joined
      ...(!!owner ? prefixKeys(owner, 'owner') : undefined),
      // contract field is available only if explicitly joined during query
      ...(!!contract ? prefixKeys(contract, 'contract') : undefined),
    };
  }
}
