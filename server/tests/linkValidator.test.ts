import { MongoClient, Db } from "mongodb";
import { validateURLResponse } from "./utils";

// Assuming Resource has a specific type, define it here
interface Resource {
  manta_link: string;
  tiles_id: string;
}

describe("Manta Resource URLlink Validator", () => {
  let client: MongoClient;
  let db: Db;

  beforeAll(async () => {
    client = await MongoClient.connect("mongodb://localhost:27017/urban_water");
    db = client.db("urban_water");
  });
  afterAll(async () => {
    await client.close();
  });

  test("Each manta link retrieved from the prism database receives an accurate web response", async () => {
    const resourceCollection = db.collection<Resource>("survey_nodes");
    const resources = await resourceCollection
      .find({}, { projection: { _id: 0, manta_link: 1, tiles_id: 1 } })
      .toArray();

    for (const resource of resources) {
      const concatenatedLink = `${resource.manta_link}${resource.tiles_id}`;
      const isValid = await validateURLResponse(concatenatedLink);
      expect(isValid).toBe(true);
    }
  });
});
