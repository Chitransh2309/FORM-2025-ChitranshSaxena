// components/CustomNode.tsx
import { Handle, NodeProps, Position } from "react-flow-renderer";

export default function CustomNode({ data }: NodeProps) {
  const handleLogicClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // ⛔ Prevent drag
    e.preventDefault(); // 🛑 Prevent flow canvas interactions
    data.onClick?.(data.id); // ✅ Trigger your modal
  };

  return (
    <div className="bg-white border rounded p-3 shadow-md w-48 text-center relative">
      <div className="text-sm font-semibold mb-2">{data.label}</div>

      {/* 🧠 Non-draggable center control */}
      <button
        className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
        onClick={handleLogicClick}
      >
        + Add Logic
      </button>

      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
}
