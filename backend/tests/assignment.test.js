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

after(async () => {
  await mongoose.disconnect();

  if (mongoServer) {
    await mongoServer.stop();
  }
});

test("Assignment API: create, retrieve, update and delete", async () => {
  const agent = request.agent(app);

  // 1. Register and authenticate a test user
  const registrationResponse = await agent.post("/api/auth/register").send({
    name: "Assignment Test User",
    email: "assignment-test@example.com",
    password: "TestPassword123",
  });

  assert.equal(registrationResponse.status, 201);

  // 2. Create an assignment
  const assignmentData = {
    title: "Web Development Coursework",
    description: "Complete the StudyTrack coursework project.",
    subject: "Web Development",
    dueDate: "2030-12-15T12:00:00.000Z",
    priority: "high",
    status: "pending",
  };

  const createResponse = await agent
    .post("/api/assignments")
    .send(assignmentData);

  assert.equal(createResponse.status, 201);
  assert.equal(createResponse.body.success, true);
  assert.equal(createResponse.body.data.title, assignmentData.title);

  const assignmentId = createResponse.body.data._id;

  assert.ok(assignmentId);

  // 3. Retrieve all assignments
  const listResponse = await agent.get("/api/assignments");

  assert.equal(listResponse.status, 200);
  assert.equal(listResponse.body.success, true);
  assert.ok(listResponse.body.data.length >= 1);

  // 4. Retrieve one assignment
  const singleResponse = await agent.get(`/api/assignments/${assignmentId}`);

  assert.equal(singleResponse.status, 200);
  assert.equal(singleResponse.body.data._id, assignmentId);

  // 5. Update the assignment
  const updateResponse = await agent
    .put(`/api/assignments/${assignmentId}`)
    .send({
      title: "Updated Web Development Coursework",
      description: "Complete and test the StudyTrack application.",
      subject: "Web Development",
      dueDate: "2030-12-20T12:00:00.000Z",
      priority: "medium",
      status: "in-progress",
    });

  assert.equal(updateResponse.status, 200);
  assert.equal(
    updateResponse.body.data.title,
    "Updated Web Development Coursework",
  );
  assert.equal(updateResponse.body.data.status, "in-progress");

  // 6. Delete the assignment
  const deleteResponse = await agent.delete(`/api/assignments/${assignmentId}`);

  assert.equal(deleteResponse.status, 200);
  assert.equal(deleteResponse.body.success, true);

  // 7. Confirm the assignment no longer exists
  const deletedResponse = await agent.get(`/api/assignments/${assignmentId}`);

  assert.equal(deletedResponse.status, 404);
});
