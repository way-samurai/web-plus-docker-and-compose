import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  async generate(password: string) {
    return await bcrypt.hash(password, 10);
  }
  async verify(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
