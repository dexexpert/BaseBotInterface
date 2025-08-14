import { AccountAddress, GetCollectionDataResponse } from "@aptos-labs/ts-sdk";
import { aptosClient } from "../utils/hyperClient";
import { getRegistry } from "../view-functions/getRegistry";

/**
 * Function to get all collections under the current contract.
 *
 * This call can be pretty expensive when fetching a big number of collections,
 * therefore it is not recommended to use it in production.
 *
 * @returns A promise that resolves to an array of collection data.
 */
export async function useGetCollections(): Promise<
  Array<GetCollectionDataResponse>
> {
  // fetch the contract registry address
  const registry = await getRegistry();

  // fetch collections objects created under that contract registry address
  const objects = await getObjects(registry);

  // get each collection object data
  const collections = await fetchCollections(objects);

  return collections;
}

const getObjects = async (
  registry: Array<{ inner: string }>
): Promise<Array<string>> => {
  const objects = await Promise.all(
    registry.map(async (register) => {
      const formattedRegistry = AccountAddress.from(register.inner).toString();
      const object = await aptosClient().getObjectDataByObjectAddress({
        objectAddress: formattedRegistry,
      });

      return object.owner_address;
    })
  );
  return objects;
};

const fetchCollections = async (
  objects: Array<string>
): Promise<Array<GetCollectionDataResponse>> => {
  const collections = await Promise.all(
    objects.map(async (object) => {
      const formattedObjectAddress = AccountAddress.from(object).toString();

      const collection = await aptosClient().getCollectionDataByCreatorAddress({
        creatorAddress: formattedObjectAddress,
      });

      return collection;
    })
  );
  return collections;
};
