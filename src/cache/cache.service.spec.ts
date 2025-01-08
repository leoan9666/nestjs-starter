import { Test, TestingModule } from '@nestjs/testing';
import { TCacheService } from './cache.service';

describe('CacheService', () => {
  let service: TCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TCacheService],
    }).compile();

    service = module.get<TCacheService>(TCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
