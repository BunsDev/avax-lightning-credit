import { PartialType } from '@nestjs/mapped-types';
import { CreateNtbtDto } from './create-tpft.dto';

export class UpdateNtbtDto extends PartialType(CreateNtbtDto) {}
