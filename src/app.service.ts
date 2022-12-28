import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { Contract } from './api/contract/contract.entity';
import { Rarible2NFT } from './api/nft/nft.dto';
import { NFT } from './api/nft/nft.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Contract) private readonly ContractRepo: Repository<Contract>,
    @InjectRepository(NFT) private readonly NftRepo: Repository<NFT>
  ) {}

  /**
   * Recursively retrieves collection data (the NFTs inside it) from Rarible's API
   * returning an aggregate list of NFTs.
   * @method @async @throws
   * @param {string} collection - The collection multichain address
   * @param {string} session - The session id (for recursive call and requests to Rarible)
   * @returns {Promise<Record<unknown>>} - The list of NFTs in the collection (Rarible format)
   */
  private async GetRaribleCollection(collection: string, session = '') {
    // Interpolates the REST endpoint URL and the query params for the endpoint
    const getCollectionUrl = `${process.env.RARIBLE_API}/items/byCollection`;
    const query = { collection, limit: 1000, continuation: session };

    // Makes the request and converts it back to an AxiosResponse object (prev. Observable)
    const { data } = await axios.get(getCollectionUrl, { params: query });

    // Destructure the needed fields in the response
    const { items, continuation } = data;

    for (const nft of items) {
      // Interpolates the REST endpoint URL and the query params for the endpoint
      const getOwnerUrl = `${process.env.RARIBLE_API}/ownerships/byItem`;

      // Makes the request and converts it back to an AxiosResponse object (prev. Observable)
      const { data } = await axios.get(getOwnerUrl, { params: { itemId: nft.id } });

      // Updates the local NFT reference with the current owner
      nft.owner = data.ownerships[0]?.owner;
    }

    if (continuation !== undefined) {
      // If a continuation is present we fetch recursively the other pages
      const others = await this.GetRaribleCollection(collection, continuation);
      // An aggregate array/vector with all the results is returned
      return [...items, ...others];
    }

    return items;
  }

  /**
   * Scrape new data and updates the values obtained in our internal database.
   * @method @async @throws
   */
  public async ScrapeFromRarible() {
    // Get the addresses of all the Smart Contracts in the database
    const contracts = await this.ContractRepo.find({ select: ['address'] });

    for (const contract of contracts) {
      // Retrieves all the NFT for the current Smart Contract/Collection
      const collection_nfts = await this.GetRaribleCollection(contract.address);
      // Converts Rarible data format to our internal one
      const internal_nfts = collection_nfts.map(item => plainToClass(Rarible2NFT, item));

      // ! Only temporary since Rarible doesn't populate item.contract for SOLANA
      if (contract.address.includes('SOLANA:'))
        internal_nfts.forEach(x => (x.contract.address = contract.address));

      // Updates the entries that have been changed on the database as well
      await this.NftRepo.save(internal_nfts, { chunk: 100 });

      // Print a simple report
      console.debug(`Contract (${contract.address}) has ${collection_nfts.length} NFTs`);
    }
  }
}
