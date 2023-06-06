import AutoSizer, { VerticalSize } from "react-virtualized-auto-sizer";
import { FC, useCallback, useEffect, useRef } from "react";
import {
  VariableSizeNodeComponentProps,
  VariableSizeNodeData,
  VariableSizeTree
} from "react-vtree";

type DataNode = Readonly<{
  children: DataNode[];
  id: number;
  name: string;
}>;

type StackElement = Readonly<{
  nestingLevel: number;
  node: DataNode;
}>;

type ExtendedData = VariableSizeNodeData &
  Readonly<{
    isLeaf: boolean;
    name: string;
    nestingLevel: number;
  }>;

let nodeId = 0;

const createNode = (depth: number = 0) => {
  const node: DataNode = {
    children: [],
    id: nodeId,
    name: `test-${nodeId}`
  };

  nodeId += 1;

  if (depth === 5) {
    return node;
  }

  for (let i = 0; i < 5; i++) {
    node.children.push(createNode(depth + 1));
  }

  return node;
};

const rootNode = createNode();
const defaultGapStyle = { marginLeft: 10 };
const defaultButtonStyle = { fontFamily: "Courier New" };

const Node: FC<VariableSizeNodeComponentProps<ExtendedData>> = ({
  height,
  data: { id, isLeaf, name, nestingLevel },
  isOpen,
  resize,
  style,
  toggle,
  treeData: itemSize
}) => {
  const canOpen = height <= itemSize;
  const halfSize = itemSize / 2;

  const toggleNodeSize = useCallback(
    () => resize(canOpen ? height + halfSize : height - halfSize, true),
    [height, resize]
  );

  useEffect(() => {
    // Applying resize to root node if it's height is not zero
    if (id === "0" && height !== 0) {
      resize(0, true);
    }
  }, [height]);

  return (
    <div
      style={{
        ...style,
        alignItems: "center",
        background: canOpen ? undefined : "#ddd",
        display: "flex",
        marginLeft: nestingLevel * 30 + (isLeaf ? 48 : 0),
        // Added overflowing to avoid collapsed root node to be visible
        // overflow: "hidden"
      }}
    >
      {!isLeaf && (
        <div>
          <button type="button" onClick={toggle} style={defaultButtonStyle}>
            {isOpen ? "-" : "+"}
          </button>
        </div>
      )}
      <div style={defaultGapStyle}>{name}</div>
      <div>
        <button type="button" onClick={toggleNodeSize} style={defaultGapStyle}>
          {canOpen ? "Open" : "Close"}
        </button>
      </div>
    </div>
  );
};


function* treeWalker(
  refresh: boolean
): Generator<ExtendedData | string | symbol, void, boolean> {
  const stack: StackElement[] = [];

  stack.push({
    nestingLevel: 0,
    node: rootNode
  });

  while (stack.length !== 0) {
    const { node, nestingLevel } = stack.pop()!;
    const id = node.id.toString();

    const isOpened = yield refresh
      ? {
        defaultHeight: 40,
        id,
        isLeaf: node.children.length === 0,
        isOpenByDefault: true,
        name: node.name,
        nestingLevel
      }
      : id;

    if (node.children.length !== 0 && isOpened) {
      for (let i = node.children.length - 1; i >= 0; i--) {
        stack.push({
          nestingLevel: nestingLevel + 1,
          node: node.children[i]
        });
      }
    }
  }
}

// type TreePresenterProps = Readonly<{
//   itemSize?: number;
// }>;

const TreePresenter = () => {
  const tree = useRef<VariableSizeTree<ExtendedData>>(null);

  return (
    <>
      <h1>React vtree Example</h1>
      <AutoSizer disableWidth>
        {({ height }: VerticalSize) => (
          <VariableSizeTree
            ref={tree}
            itemData={50}
            treeWalker={treeWalker}
            height={height}
            width="100%"
          >
            {Node}
          </VariableSizeTree>
        )}
      </AutoSizer>
    </>
  );
};

export default TreePresenter;