import { Controller, Get, Header, UseInterceptors } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudOptions, CrudRequest, CrudRequestInterceptor, ParsedRequest } from '@nestjsx/crud';
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

  @ApiProduces('text/csv')
  @ApiOperation({ summary: 'Returns a the results of the query in csv' })
  @ApiOkResponse({ description: 'The csv textual content', type: 'string' })
  @ApiBadRequestResponse({ description: 'Wrong query params format provided' })
  /*----------------------------------------------------------------*/
  /*     Returns the same results as a GET /nft but in csv format   */
  /*----------------------------------------------------------------*/
  @Get('export')
  @Header('Content-Type', 'text/csv')
  @UseInterceptors(CrudRequestInterceptor)
  public exportManyBase(@ParsedRequest() req: CrudRequest) {
    return this.service.exportMany(req);
  }
}
