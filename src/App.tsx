import AutoSizer, { VerticalSize } from 'react-virtualized-auto-sizer';
import { FixedSizeNodeData, FixedSizeNodePublicState, FixedSizeTree, TreeWalkerValue } from 'react-vtree';

import { ListChildComponentProps } from 'react-window';
import { getNodesMock } from './services/services';
import { useState } from 'react';

const NUMBER_OF_NODES_EACH_REQUEST = 5;

export type TreeNode = {
  children?: TreeNode[];
  downloaded: boolean;
  id: number;
  name: string;
};

export type TreeData = FixedSizeNodeData &
{
  downloaded: boolean;
  download: () => void;
  isLeaf: boolean;
  name: string;
  nestingLevel: number;
};

type NodePublicState<TData extends FixedSizeNodeData> = Readonly<{
  data: TData;
  setOpen: (state: boolean) => Promise<void>;
}> & {
  isOpen: boolean;
};

export type TreeWalker<TData extends FixedSizeNodeData, TMeta = {}> = () => Generator<
  TreeWalkerValue<TData, TMeta> | undefined,
  undefined,
  TreeWalkerValue<TData, TMeta>
>;

type NodeMeta = Readonly<{
  nestingLevel: number;
  node: TreeNode;
}>;

const getNodeData = (
  node: TreeNode,
  nestingLevel: number,
  download: () => void,
  isOpenByDefault: boolean = false
): TreeWalkerValue<TreeData, NodeMeta> => ({
  data: {
    download,
    downloaded: node.downloaded,
    id: node.id.toString(),
    isLeaf: !node.children,
    isOpenByDefault: isOpenByDefault && !!node.children && node.children?.length > 0 && node.downloaded,
    name: node.name,
    nestingLevel,
  },
  nestingLevel,
  node,
});

export type NodeComponentProps<
  TData extends FixedSizeNodeData,
  TNodePublicState extends NodePublicState<TData>
> = Readonly<
  Omit<ListChildComponentProps, 'data' | 'index'> &
  TNodePublicState & {
    /**
     * The data provided by user via `itemData` Tree component property.
     */
    treeData?: TData;
  }
>;


const Node = ({
  data: { download, downloaded, isLeaf, name, nestingLevel },
  isOpen,
  style,
  setOpen,
}: NodeComponentProps<
  TreeData,
  FixedSizeNodePublicState<TreeData>
>) => {
  const [isLoading, setLoading] = useState(false);

  const handleToogle = async () => {
    if (downloaded) {
      await setOpen(!isOpen);
    } else {
      setLoading(true);
      await download();
      await setOpen(!isOpen);
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        ...style,
        alignItems: 'center',
        display: 'flex',
        paddingLeft: nestingLevel * 30 + (isLeaf ? 20 : 0),
      }}
    >
      {!isLeaf && (
        <div>
          <button
            type="button"
            onClick={handleToogle}
          >
            {isLoading ? '⌛' : isOpen ? '-' : '+'}
          </button>
        </div>
      )}
      <div style={{ paddingLeft: 10, whiteSpace: 'nowrap' }}>{name}</div>
    </div>
  );
};

type Props = {
  defaultTreeNodes: TreeNode[];
}

const App = ({ defaultTreeNodes }: Props) => {
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>(defaultTreeNodes);

  const insertNodes = (nodesToInsert: TreeNode[], nodeId: number, treeNodes: TreeNode[]) => {
    for (let i = 0; i < treeNodes.length; i++) {
      if (treeNodes[i].id === nodeId) {
        treeNodes[i] = {
          ...treeNodes[i],
          downloaded: true,
          children: nodesToInsert
        }
      } else if (treeNodes[i].children) {
        insertNodes(nodesToInsert, nodeId, treeNodes[i].children!);
      }
    }
  }

  const createDownloader = (node: TreeNode) => async (): Promise<void> => {
    const newNodes = await getNodesMock(NUMBER_OF_NODES_EACH_REQUEST);

    setTreeNodes(prev => {
      const prevCopy = [...prev];
      insertNodes(newNodes, node.id, prevCopy);
      return prevCopy;
    });
  }

  function* treeWalker(): ReturnType<TreeWalker<TreeData, NodeMeta>> {
    // Step [1]: Define the root node of our tree. There can be one or
    // multiple nodes. 
    for (let i = 0; i < treeNodes.length; i++) {
      yield getNodeData(treeNodes[i], 0, createDownloader(treeNodes[i]), false);
    }

    while (true) {
      // Step [2]: Get the parent component back. It will be the object
      // the `getNodeData` function constructed, so you can read any data from it.
      const parentMeta = yield;

      if (parentMeta.data.downloaded && parentMeta.node.children) {
        for (let i = 0; i < parentMeta.node.children.length; i++) {
          // Step [3]: Yielding all the children of the provided component. Then we
          // will return for the step [2] with the first children.
          yield getNodeData(
            parentMeta.node.children[i],
            parentMeta.nestingLevel + 1,
            createDownloader(parentMeta.node.children[i])
          );
        }
      }
    }
  }

  return (
    <AutoSizer disableWidth>
      {({ height }: VerticalSize) => (
        <FixedSizeTree
          treeWalker={treeWalker}
          itemSize={30}
          height={height}
          async={true}
          width="100%"
        >
          {Node}
        </FixedSizeTree>
      )}
    </AutoSizer>
  );

}

export default App;