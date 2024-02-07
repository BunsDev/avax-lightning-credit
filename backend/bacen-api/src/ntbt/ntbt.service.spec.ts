import { Test, TestingModule } from '@nestjs/testing';
import { NtbtService } from './ntbt.service';

describe('TpftService', () => {
  let service: NtbtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NtbtService],
    }).compile();

    service = module.get<NtbtService>(NtbtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
