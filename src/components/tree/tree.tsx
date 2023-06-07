import { TreeNode, TreeNodeModel, TreeNodeProps } from "./tree-node";

import { useState } from "react";

type TreeProps = {
  nodes: TreeNodeModel[];
} & Pick<TreeNodeProps, 'nodeTemplate' | 'loadMoreNodes' | 'onSelectedNode'>

const Tree = ({ nodes, nodeTemplate, loadMoreNodes, onSelectedNode }: TreeProps) => {
  const [selectedNode, setSelectedNode] = useState<TreeNodeModel | undefined>(undefined);

  return (
    <div>
      {nodes.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          nestingLevel={0}
          nodeTemplate={nodeTemplate}
          selectedNode={selectedNode}
          loadMoreNodes={loadMoreNodes}
          onSelectedNode={node => {
            setSelectedNode(node);
            onSelectedNode?.(node);
          }}
        />
      ))}
    </div>
  )
}

export default Tree;