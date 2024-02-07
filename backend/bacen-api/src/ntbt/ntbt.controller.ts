import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateNtbtDto as CreateNtbtDto } from './dto/create-tpft.dto';
import { UpdateNtbtDto as UpdateNtbtDto } from './dto/update-tpft.dto';
import { NtbtService } from './ntbt.service';

@Controller('NTBts')
export class NtbtController {
  constructor(private readonly ntbtService: NtbtService) {}

  @Post()
  create(@Body() createNtbtDto: CreateNtbtDto) {
    return this.ntbtService.createNTBt(createNtbtDto);
  }

  @Get()
  findAll() {
    return this.ntbtService.getAllNTBts();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ntbtService.getNTBt(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNtbtDto: UpdateNtbtDto) {
    return this.ntbtService.udpateNTBt(id, updateNtbtDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.tpftService.deleteTPFt(id);
  // }

  @Get('/wallet/:walletId')
  findByWallet(@Param('walletId') walletId: string) {
    return this.ntbtService.getNTBtByWallet(walletId);
  }
}
