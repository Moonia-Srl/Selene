import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest, GetManyDefaultResponse } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { utils as xlsx_utils } from 'xlsx';
import { NFT } from './nft.entity';

@Injectable()
export class NFTService extends TypeOrmCrudService<NFT> {
  constructor(@InjectRepository(NFT) repository) {
    super(repository);
  }

  /**
   * Converts a (SELECT-WHERE-FROM) query result (an array of items) to a csv
   * representation encoded as a binary memory buffer.
   * The usage of Buffer allows to be more general and abstract as possible:
   * e.g. it can be streamed back to the client or written as a file on the server
   * @method @throws
   * @param {GetManyDefaultResponse<NFT> | NFT[]} qResults- Entries to be converted
   * @returns {Buffer} - The csv file content to be handled as desired
   */
  private QueryToCsv(qResults: GetManyDefaultResponse<NFT> | NFT[]): string {
    // Based on the datatype received, extracts the item array
    const items = Array.isArray(qResults) ? qResults : qResults.data;
    // Converts the flattened NFT array to a sheet object
    const sheet = xlsx_utils.json_to_sheet(items.map(i => i.LinearObject()));
    return xlsx_utils.sheet_to_csv(sheet, { blankrows: true });
  }

  /**
   * Wrapper around the underlying implementation of getMany() method that
   * converts the result to a csv tabular files and streams is back to the user.
   * @method @async @throws
   * @param {CrudRequest} req - The request query params (filter, joins, ...)
   * @returns {StreamableFile} - A .csv file to be downloaded
   */
  public async exportMany(req: CrudRequest): Promise<string> {
    // Retrieves the NFT using the underlying implementation of TypeOrmCrudService
    const qResults = await super.getMany(req);
    // Converts the query results to a csv buffer
    return this.QueryToCsv(qResults);
  }
}
