import { useLayoutEffect, useState } from "react";

export type TreeNodeModel = {
  id: string;
  label: string;
  lazyLoad?: boolean;
  children?: TreeNodeModel[];
}

export type TreeNodeTemplateProps = {
  node: TreeNodeModel;
  nestingLevel: number;
  loading?: boolean;
  selected?: boolean;
  onToogle?: () => void;
  onSelected?: () => void;
};

export type TreeNodeProps = TreeNodeTemplateProps & {
  selectedNode?: TreeNodeModel | undefined;
  nodeTemplate: (props: TreeNodeTemplateProps) => React.ReactNode;
  loadMoreNodes?: (node: TreeNodeModel) => Promise<TreeNodeModel[]>;
  onSelectedNode?: (node: TreeNodeModel) => void;
}

const TreeNode = ({ node, nestingLevel, selectedNode, nodeTemplate, loadMoreNodes, onSelectedNode }: TreeNodeProps) => {
  const [selected, setSelected] = useState(selectedNode?.id === node.id ?? false);
  const [innerNode, setInnerNode] = useState(node);
  const [loading, setLoading] = useState(false);
  const [open, setIsOpen] = useState(false);

  const hasChildren = (innerNode.children && innerNode.children?.length > 0) ?? false;

  const handleOnToogle = async (node: TreeNodeModel) => {
    setIsOpen((value) => !value);

    if (!hasChildren && node.lazyLoad) {
      setLoading(true);

      const nodesChildren = await loadMoreNodes?.(node)
      setInnerNode((prev) => ({ ...prev, children: nodesChildren }));

      setLoading(false);
    }
  }

  useLayoutEffect(() => {
    setSelected(selectedNode ? selectedNode.id === node.id : false);
  }, [selectedNode])

  return (
    <>
      {
        nodeTemplate({
          node: innerNode,
          nestingLevel,
          loading,
          selected,
          onToogle: () => handleOnToogle(innerNode),
          onSelected: () => onSelectedNode?.(innerNode)
        })
      }
      {open && hasChildren
        ? innerNode.children?.map((child) =>
          <TreeNode
            key={child.id}
            node={child}
            nestingLevel={nestingLevel + 1}
            nodeTemplate={nodeTemplate}
            selectedNode={selectedNode}
            onSelectedNode={onSelectedNode}
            loadMoreNodes={loadMoreNodes} />
        )
        : null}
    </>
  );
}

export { TreeNode };