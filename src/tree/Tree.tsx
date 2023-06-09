import AutoSizer, { VerticalSize } from 'react-virtualized-auto-sizer';
import { ComponentType, useState } from 'react';
import { FixedSizeNodeData, FixedSizeNodePublicState, FixedSizeTree, TreeWalkerValue } from 'react-vtree';

import { ListChildComponentProps } from 'react-window';
import { getNodesMock } from '../services/services';

const NUMBER_OF_NODES_EACH_REQUEST = 5;

type TreeData = FixedSizeNodeData &
{
  name: string;
  isLeaf: boolean;
  downloaded: boolean;
  nestingLevel: number;
  download: () => void;
};

type NodePublicState<TData extends FixedSizeNodeData> = Readonly<{
  data: TData;
  setOpen: (state: boolean) => Promise<void>;
}> & {
  isOpen: boolean;
};

type NodeModel<
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

export type TreeNode = {
  id: number;
  name: string;
  downloaded: boolean;
  isOpenDefault?: boolean;
  children?: TreeNode[];
};

export type TreeNodeTemplateProps = NodeModel<TreeData, FixedSizeNodePublicState<TreeData>>;

type TreeWalker<TData extends FixedSizeNodeData, TMeta = {}> = () => Generator<
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
): TreeWalkerValue<TreeData, NodeMeta> => ({
  data: {
    download,
    downloaded: !!node.children && node.children.length > 0,
    id: node.id.toString(),
    isLeaf: !node.children,
    isOpenByDefault: (node.isOpenDefault ?? false) && !!node.children && node.children?.length > 0 && node.downloaded,
    name: node.name,
    nestingLevel,
  },
  nestingLevel,
  node,
});

type Props = {
  Node: ComponentType<TreeNodeTemplateProps>;
  defaultTreeNodes: TreeNode[];
}

const Tree = ({ Node, defaultTreeNodes }: Props) => {
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

  const createDownloader = (node: TreeNode, nestingLevel: number) => async (): Promise<void> => {
    const newNodes = await getNodesMock(NUMBER_OF_NODES_EACH_REQUEST, nestingLevel);

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
      yield getNodeData(treeNodes[i], 0, createDownloader(treeNodes[i], 0));
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
            createDownloader(parentMeta.node.children[i], parentMeta.nestingLevel + 1)
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

export default Tree;