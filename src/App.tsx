import { DATA } from "./constants/constants";
import { NodeTemplate } from "./components/NodeTemplate";
import Tree from "./tree/Tree";

const App = () => <Tree Node={NodeTemplate} defaultTreeNodes={DATA} />

export default App;