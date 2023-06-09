import { TreeNodeTemplateProps } from "../tree/Tree";
import { useState } from "react";

const NodeTemplate = ({
  data: { download, downloaded, isLeaf, name, nestingLevel },
  isOpen,
  style,
  setOpen,
}: TreeNodeTemplateProps) => {
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

export { NodeTemplate }