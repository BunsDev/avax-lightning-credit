import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BankController } from './bank/bank.controller';
import { BankModule } from './bank/bank.module';
import { BankService } from './bank/bank.service';
import { BankSchema } from './schemas/bank.schema';
import { WalletSchema } from './schemas/wallet.schema';
import { WalletController } from './wallets/wallets.controller.spec';
import { WalletsModule } from './wallets/wallets.module';
import { WalletService } from './wallets/wallets.service';
import { NTBtSchema } from './schemas/ntbt.schema';
import { NTBtModule } from './ntbt/ntbt.module';
import { NtbtController } from './ntbt/ntbt.controller';
import { NtbtService } from './ntbt/ntbt.service';
import { SelicModule } from './selic/selic.module';
import { SelicController } from './selic/selic.controller';
import { SelicService } from './selic/selicServices/selic.service';
import { SelicProfitCalculatorService } from './selic/selicServices/selicProfitCaculator.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://rgb:gruporgb@nodeexpress.ps2xp1a.mongodb.net/?retryWrites=true&w=majority',
      { dbName: 'bacen' },
    ),
    MongooseModule.forFeature([{ name: 'Bank', schema: BankSchema }]),
    MongooseModule.forFeature([{ name: 'Wallet', schema: WalletSchema }]),
    MongooseModule.forFeature([{ name: 'TPFt', schema: NTBtSchema }]),
    BankModule,
    WalletsModule,
    NTBtModule,
    SelicModule,
  ],
  controllers: [
    AppController,
    BankController,
    WalletController,
    NtbtController,
    SelicController,
  ],
  providers: [
    AppService,
    BankService,
    WalletService,
    NtbtService,
    SelicService,
    SelicProfitCalculatorService,
  ],
})
export class AppModule {}
