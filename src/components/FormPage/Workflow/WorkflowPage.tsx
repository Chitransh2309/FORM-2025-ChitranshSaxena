"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import getFormObject from "@/app/action/getFormObject";
import { Section } from "@/lib/interface";
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  applyNodeChanges,
  applyEdgeChanges,
  NodeTypes,
} from "react-flow-renderer";
import CustomNode from "./CustomNode"; // ✅ Your custom node
import { useMemo } from "react";

type Condition = {
  fieldId: string;
  op: "equal";
  value: string;
};

type LogicRule = {
  triggerSectionId: string;
  action: {
    type: "jump";
    to: string;
    condition: Condition[];
  };
};

export default function WorkflowPage({ form_ID }: { form_ID: string }) {
  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  const [sections, setSections] = useState<Section[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [logicRules, setLogicRules] = useState<LogicRule[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null
  );

  const [showModal, setShowModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const [selectedOp, setSelectedOp] = useState<"equal">("equal");
  const [conditionValue, setConditionValue] = useState<string>("");
  const [targetSection, setTargetSection] = useState<string>("");

  useEffect(() => {
    const loadForm = async () => {
      if (!form_ID) return;

      const res = await getFormObject(form_ID);
      if (res.success && res.data?.sections) {
        const formSections = res.data.sections;
        setSections(formSections);

        const flowNodes: Node[] = formSections.map((section, idx) => ({
          id: section.section_ID,
          type: "custom",
          position: { x: 300 * idx, y: 100 },
          data: {
            label: section.title || `Section ${idx + 1}`,
            id: section.section_ID,
            onClick: handleOpenModal, // ✅ Must be here
          },
        }));

        setNodes(flowNodes);
      } else {
        toast.error("Failed to load form.");
      }
    };

    loadForm();
  }, [form_ID]);

  useEffect(() => {
    const flowEdges: Edge[] = logicRules.map((rule, idx) => ({
      id: `e-${rule.triggerSectionId}-${rule.action.to}-${idx}`,
      source: rule.triggerSectionId,
      target: rule.action.to,
      animated: true,
      label: rule.action.condition
        .map((c) => `${c.fieldId} == ${c.value}`)
        .join(" & "),
      labelStyle: { fontSize: 12 },
    }));

    setEdges(flowEdges);
  }, [logicRules]);

  const handleOpenModal = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    setShowModal(true);
    setSelectedQuestion("");
    setConditionValue("");
    setTargetSection("");
  };

  const handleAddLogic = () => {
    if (
      !selectedSectionId ||
      !selectedQuestion ||
      !targetSection ||
      !conditionValue
    ) {
      toast.error("Please fill all fields");
      return;
    }

    const newRule: LogicRule = {
      triggerSectionId: selectedSectionId,
      action: {
        type: "jump",
        to: targetSection,
        condition: [
          { fieldId: selectedQuestion, op: selectedOp, value: conditionValue },
        ],
      },
    };

    setLogicRules((prev) => [...prev, newRule]);
    setShowModal(false);
  };

  const selectedSection = sections.find(
    (s) => s.section_ID === selectedSectionId
  );
  const otherSections = sections.filter(
    (s) => s.section_ID !== selectedSectionId
  );

  return (
    <div className="text-black w-full h-[90vh] p-4 flex gap-6">
      <div className="flex-1 rounded-md">
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={(changes) =>
              setNodes((nds) => applyNodeChanges(changes, nds))
            }
            onEdgesChange={(changes) =>
              setEdges((eds) => applyEdgeChanges(changes, eds))
            }
            nodeTypes={nodeTypes} // ✅ Register custom node
            fitView
            style={{ background: "#2B2A2A" }}
          >
            <Background />
            <MiniMap />
            <Controls />
          </ReactFlow>
        </ReactFlowProvider>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Add Logic Condition</h2>

            <div className="mb-3">
              <label className="block mb-1 text-sm font-medium">Question</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={selectedQuestion}
                onChange={(e) => setSelectedQuestion(e.target.value)}
              >
                <option value="">Select a question</option>
                {selectedSection?.questions.map((q) => (
                  <option key={q.question_ID} value={q.question_ID}>
                    {q.questionText}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="block mb-1 text-sm font-medium">Value</label>
              <input
                type="text"
                className="w-full border rounded px-2 py-1"
                placeholder="e.g., Yes"
                value={conditionValue}
                onChange={(e) => setConditionValue(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="block mb-1 text-sm font-medium">
                Go to Section
              </label>
              <select
                className="w-full border rounded px-2 py-1"
                value={targetSection}
                onChange={(e) => setTargetSection(e.target.value)}
              >
                <option value="">Select destination</option>
                {otherSections.map((s) => (
                  <option key={s.section_ID} value={s.section_ID}>
                    {s.title || s.section_ID}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 border rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLogic}
                className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
