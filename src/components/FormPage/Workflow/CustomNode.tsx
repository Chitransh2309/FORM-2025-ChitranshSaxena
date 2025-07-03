// components/CustomNode.tsx
import { Handle, NodeProps, Position } from "reactflow";

export default function CustomNode({ data }: NodeProps) {
  const handleLogicClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 🔒 Stop drag/pan
    data.onClick?.(data.id);
  };

  return (
    <div className="bg-white border rounded shadow-md w-48 text-center relative">
      <div className="p-3 cursor-move font-semibold text-sm">{data.label}</div>

      {/* Clickable Zone (not draggable) */}
      <div className="pb-2">
        <button
          onClick={handleLogicClick}
          className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + Add Logic
        </button>
      </div>

      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
}
