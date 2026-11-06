import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

import app from "../src/app.js";

let mongoServer;

before(
  async () => {
    process.env.NODE_ENV = "test";
    process.env.JWT_SECRET = "studytrack-test-secret-key";
    process.env.JWT_EXPIRES_IN = "1d";
    process.env.COOKIE_NAME = "studytrack_token";
    mongoServer = await MongoMemoryServer.create({
      binary: {
        version: "7.0.14",
        downloadDir: "G:\\mongodb-cache",
      },
      instance: {
        dbPath: "G:\\mongodb-temp\\auth-test",
        storageEngine: "wiredTiger",
        launchTimeout: 60000,
      },
    });

    await mongoose.connect(mongoServer.getUri());
  },
  { timeout: 90000 },
);

after(
  async () => {
    await mongoose.disconnect();

    if (mongoServer) {
      await mongoServer.stop();
    }
  },
  { timeout: 30000 },
);
