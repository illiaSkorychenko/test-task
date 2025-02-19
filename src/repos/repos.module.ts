import { Module } from '@nestjs/common';
import { ProductRepoService } from './product-repo.service';

@Module({
  providers: [ProductRepoService],
  exports: [ProductRepoService]
})
export class ReposModule {}
