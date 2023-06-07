import { DATA, DATA_LAZY } from "./constants/constants";
import { TreeNodeModel, TreeNodeTemplateProps } from "./components/tree/tree-node";

import Tree from "./components/tree/tree";

const TreeNodeComponent = ({ node, nestingLevel, loading, selected, onToogle, onSelected }: TreeNodeTemplateProps) => {
  return (
    <div
      style={{ cursor: "pointer", marginLeft: nestingLevel * 16, backgroundColor: selected ? 'lightblue' : 'white' }}>
      {loading ?
        <span>Loading...</span> :
        <div style={{ display: 'flex' }} onClick={() => {
          onSelected?.();
          onToogle?.();
        }}>
          <span>
            {node.label}
          </span>
          <div>
            ✨
          </div>
        </div>
      }
    </div>);
};

const App = () => {
  const handleOnExpand = (nodeEvent: TreeNodeModel) => {
    console.info("load children for node with id: ", nodeEvent.id)
    return new Promise<TreeNodeModel[]>((res) => setTimeout(() => res(DATA_LAZY), 2000));
  }

  return (
    <div className="App">
      <Tree nodes={DATA} nodeTemplate={TreeNodeComponent} loadMoreNodes={handleOnExpand} />
    </div>
  );
}

export default App;