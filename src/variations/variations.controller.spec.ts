import { Test, TestingModule } from '@nestjs/testing';
import { VariationsController } from './variations.admin.controller';

describe('VariationsController', () => {
  let controller: VariationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VariationsController],
    }).compile();

    controller = module.get<VariationsController>(VariationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
