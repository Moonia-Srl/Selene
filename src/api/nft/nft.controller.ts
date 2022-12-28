import { Controller, Get, StreamableFile, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudOptions,
  CrudRequest,
  CrudRequestInterceptor,
  ParsedRequest,
} from '@nestjsx/crud';
import { utils as xlsx_utils, write as xlsx_write } from 'xlsx';
import { NFTDto } from './nft.dto';
import { NFT } from './nft.entity';
import { NFTService } from './nft.service';

const CrudConfiguration: CrudOptions = {
  model: { type: NFT },
  dto: { create: NFTDto, update: NFTDto },
  params: { tokenId: { field: 'tokenId', type: 'string', primary: true } },
  query: { join: { owner: { eager: false }, contract: { eager: false } } },
  routes: process.env.NODE_ENV !== 'development' ? { only: ['getManyBase'] } : null,
};

@Crud(CrudConfiguration)
@Controller('nfts')
@ApiTags('NFTs')
export class NFTController implements CrudController<NFT> {
  constructor(public service: NFTService) {}

  get base(): CrudController<NFT> {
    return this;
  }

  // TODO Refactor this endpoint
  @Get('export')
  @UseInterceptors(CrudRequestInterceptor)
  async exportSome(@ParsedRequest() req: CrudRequest) {
    // Retrieves the NFT as implemented in the CRUD library
    const NFTs = (await this.base.getManyBase(req)) as Array<NFT>;

    // Creates a workbook in which put the sheet/data
    const workbook = xlsx_utils.book_new();
    // Converts the NFT array to a WorkSheet object and adds it to the WorkBook
    const worksheet = xlsx_utils.json_to_sheet(
      NFTs.map(nft => ({ ...nft, ...nft?.owner, owner: undefined, contract: undefined }))
    );
    xlsx_utils.book_append_sheet(workbook, worksheet);

    // Converts/writes the workbook to a buffer, that is streamed back to the user
    const csv_buffer = xlsx_write(workbook, { type: 'buffer', bookType: 'csv' });
    return new StreamableFile(csv_buffer);
  }
}
