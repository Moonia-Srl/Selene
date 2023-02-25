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
    @InjectRepository(NFT) private readonly NftRepo: Repository<NFT>,
  ) { }

  /**
   * Recursively retrieves collection data (the NFTs inside it) from Rarible's API
   * returning an aggregate list of NFTs.
   * @method @async @throws
   * @param {string} collection - The collection multichain address
   * @param {string} session - The session id (for recursive call and requests to Rarible)
   * @returns {Promise<Record<unknown>>} - The list of NFTs in the collection (Rarible format)
   */
  private async GetRaribleCollection(collection: string, session = '') {
    // Makes a request to the Rarible API to fetch a fraction of the NFTs in the 'collection'
    const query = { collection, limit: 1000, continuation: session };
    const getCollectionUrl = `${process.env.RARIBLE_API}/items/byCollection`;
    const { data: { items, continuation } } = await axios.get(getCollectionUrl, { params: query });

    // For each NFT determine the owner wallet by querying another endpoint
    for (const nft of items) {
      // Makes a request to the Rarible API to fetch the wallet that owns the current 'nft'
      const getOwnerUrl = `https://rarible.com/marketplace/api/v4/items/${nft.id.replace(':', '-')}/ownerships`
      // Makes the request and converts it back to an AxiosResponse object (prev. Observable)
      const { data: [ownership] } = await axios.get(getOwnerUrl);
      nft.owner = ownership?.owner?.replace('-', ':'); // Updates the local object with the owner address
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

      // Updates the entries that have been changed on the database as well
      await this.NftRepo.save(internal_nfts, { chunk: 100 });

      // Print a simple report
      console.debug(`Contract (${contract.address}) has ${collection_nfts.length} NFTs`);
    }
  }
}
