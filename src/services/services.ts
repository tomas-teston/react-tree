import { TreeNode } from "../App";

const DELAY_MS = 500;
const MAX_NESTING_LEVEL = 2;

const getIdRandom = () => Math.floor(Math.random() * 100000);

const getNodesMock = (numberOfItems: number, nestingLevel: number): Promise<TreeNode[]> => 
  new Promise((resolve) => {
      setTimeout(() => 
        resolve(Array.from(Array(numberOfItems).keys()).map<TreeNode>(_ => {
          const newId = getIdRandom()
          return {
            name: `Node #${newId}`,
            id: newId,
            downloaded: false,
            children: nestingLevel < MAX_NESTING_LEVEL ? [] : undefined,
          }
        }))
      , DELAY_MS);
    });
    
export { getNodesMock };