import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateNtbtDto {
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @MaxLength(200)
  @IsNotEmpty()
  readonly address: string;

  @IsString()
  @MaxLength(200)
  @IsNotEmpty()
  readonly balance: number;

  @IsString()
  @MaxLength(200)
  @IsNotEmpty()
  readonly value: {
    initial: number;
    final: number;
    current: number;
  };

  @IsString()
  @MaxLength(200)
  @IsNotEmpty()
  readonly assetType: string;
}
