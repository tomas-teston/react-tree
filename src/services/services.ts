import { TreeNode } from "../App";

const DELAY_MS = 500;

const getIdRandom = () => Math.floor(Math.random() * 1000);

const getNodesMock = (numberOfItems: number): Promise<TreeNode[]> => {
  return new Promise((resolve) => {
      setTimeout(() => 
        resolve(Array.from(Array(numberOfItems).keys()).map(x => {
          const newId = getIdRandom()
          return {
            name: `Node #${newId}`,
            id: newId,
            downloaded: false,
            children: []
          }
        }))
      , DELAY_MS);
    });
};

export { getNodesMock };