import "./middlewares/db.js";
import mongoose from "mongoose";

const db = mongoose.connection.db;

await db.command({
  collMod: "users",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "email", "name", "password", "rootDirId"],
      properties: {
        _id: {
          bsonType: "objectId",
        },
        email: {
          bsonType: "string",
        },
        name: {
          bsonType: "string",
          minLength: 3,
        },
        password: {
          bsonType: "string",
          minLength: 4,
        },
        rootDirId: {
          bsonType: "objectId",
        },
        _v: {
          bsonType: "int",
        },
      },
    },
  },
});

await db.command({
  collMod: "directories",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "name", "parentDirId", "userId"],
      properties: {
        _id: {
          bsonType: "objectId",
        },
        name: {
          bsonType: "string",
        },
        parentDirId: {
          bsonType: ["null", "objectId"],
        },
        userId: {
          bsonType: "objectId",
        },
        _v: {
          bsonType: "int",
        },
      },
    },
  },
});

await db.command({
  collMod: "files",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "name", "parentDirId", "userId", "extension"],
      properties: {
        _id: {
          bsonType: "objectId",
        },
        name: {
          bsonType: "string",
        },
        parentDirId: {
          bsonType: "objectId",
        },
        userId: {
          bsonType: "objectId",
        },
        extension: {
          bsonType: "string",
        },
        _v: {
          bsonType: "int",
        },
      },
    },
  },
});

await mongoose.connection.getClient().close();
