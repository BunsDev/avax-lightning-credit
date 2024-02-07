import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNtbtDto as CreateNtbtDto } from './dto/create-tpft.dto';
import { UpdateNtbtDto as UpdateNtbtDto } from './dto/update-tpft.dto';
import { INTBt } from './ntbt.interface';

@Injectable()
export class NtbtService {
  constructor(@InjectModel('NTBt') private ntbtModel: Model<INTBt>) {}
  async createNTBt(createNtbtDto: CreateNtbtDto): Promise<INTBt> {
    const newNTBt = await new this.ntbtModel(createNtbtDto);
    return newNTBt.save();
  }
  async udpateNTBt(
    ntbtId: string,
    updateNtbtDto: UpdateNtbtDto,
  ): Promise<INTBt> {
    const existingNTBt = await this.ntbtModel.findByIdAndUpdate(
      ntbtId,
      updateNtbtDto,
      { new: true },
    );
    if (!existingNTBt) {
      throw new NotFoundException(`NTBt #${ntbtId} not found`);
    }
    return existingNTBt;
  }
  async getNTBtByWallet(address: string): Promise<INTBt[]> {
    const ntbts = await this.ntbtModel.find({ address }).exec();
    if (!ntbts || ntbts.length === 0) {
      throw new NotFoundException(
        `No NTBt records found for wallet with address ${address}`,
      );
    }
    return ntbts;
  }
  async getAllNTBts(): Promise<INTBt[]> {
    const ntbtData = await this.ntbtModel.find();
    if (!ntbtData || ntbtData.length == 0) {
      throw new NotFoundException('NTBts data not found');
    }
    return ntbtData;
  }
  async getNTBt(ntbtId: string): Promise<INTBt> {
    const existingNTBt = await this.ntbtModel.findById(ntbtId).exec();
    if (!existingNTBt) {
      throw new NotFoundException(`NTBt #${ntbtId} not found`);
    }
    return existingNTBt;
  }
  // async deleteTPFt(tpftId: string): Promise<ITPFt> {
  //   const deletedTPFt = await this.tpftModel.findByIdAndDelete(tpftId);
  //   if (!deletedTPFt) {
  //     throw new NotFoundException(`TPFt #${tpftId} not found`);
  //   }
  //   return deletedTPFt;
  // }
}
