import { Injectable } from '@nestjs/common';
import {
  MongooseOptionsFactory,
  MongooseModuleOptions,
} from '@nestjs/mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class MongooseConnectionOptions implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: process.env.MONGO_DATABASE_URL,
    };
  }
}
