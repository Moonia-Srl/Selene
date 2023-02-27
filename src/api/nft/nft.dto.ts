import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsMultichainAddress } from 'src/helper/validation.helper';

class MetadataDto {
  @ApiProperty() @IsNotEmpty() @IsString() type: string;
  @ApiProperty() @IsNotEmpty() @IsString() value: string;
}

class SubContractDto {
  @ApiProperty() @IsNotEmpty() @IsString() @IsMultichainAddress() address: string;
}

class SubOwnerDto {
  @ApiProperty() @IsNotEmpty() @IsString() @IsMultichainAddress() wallet: string;
}

export class NFTDto {
  @ApiProperty() @IsNotEmpty() @IsString() @IsMultichainAddress() tokenId: string;

  @ApiProperty() @IsNotEmpty() @IsString() name: string;
  @ApiProperty() @IsNotEmpty() @IsNumber() supply: number;
  @ApiProperty() @IsNotEmpty() @IsString() assetUrl: string;

  @ApiProperty({ type: () => MetadataDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MetadataDto)
  metadata: MetadataDto[];

  @ApiProperty({ type: () => SubContractDto })
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => SubContractDto)
  contract: SubContractDto;

  @ApiProperty({ type: () => SubOwnerDto })
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => SubOwnerDto)
  owner: SubOwnerDto;
}

export class Rarible2NFT {
  @Expose() @Transform(({ obj }) => obj.id) tokenId: string;

  @Expose() @Transform(({ obj }) => obj.meta?.name ?? 'ND') name: string;
  @Expose() @Transform(({ obj }) => parseInt(obj.supply)) supply: number;
  @Expose() @Transform(({ obj }) => obj.meta?.content[0]?.url ?? '') assetUrl: string;

  @Expose() @Transform(({ obj }) => obj.meta?.attributes ?? []) metadata: MetadataDto[];

  @Expose()
  @Transform(({ obj }) => ({ address: obj.contract }))
  contract: { address: string };

  @Expose()
  @Transform(({ obj }) => ({ wallet: obj.owner }))
  owner?: { wallet: string };
}
