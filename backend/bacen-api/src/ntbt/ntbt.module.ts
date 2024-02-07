import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NTBt, NTBtSchema } from 'src/schemas/ntbt.schema';
import { NtbtController } from './ntbt.controller';
import { NtbtService } from './ntbt.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: NTBt.name, schema: NTBtSchema }]),
  ],
  controllers: [NtbtController],
  providers: [NtbtService],
  exports: [NtbtService],
})
export class NTBtModule {}
