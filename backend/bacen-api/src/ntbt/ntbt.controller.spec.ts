import { Test, TestingModule } from '@nestjs/testing';
import { NtbtController } from './ntbt.controller';
import { NtbtService } from './ntbt.service';

describe('NtbtController', () => {
  let controller: NtbtController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NtbtController],
      providers: [NtbtService],
    }).compile();

    controller = module.get<NtbtController>(NtbtController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
