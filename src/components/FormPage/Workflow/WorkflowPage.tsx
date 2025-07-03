"use client";

import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import getFormObject from "@/app/action/getFormObject";
import {
  LogicRule,
  Section,
  ConditionGroupType,
  NestedCondition,
  BaseCondition,
} from "@/lib/interface";
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  applyNodeChanges,
  applyEdgeChanges,
} from "react-flow-renderer";
import CustomNode from "./CustomNode";
import { saveFormLogic } from "@/app/action/saveFormLogic";
import ConditionGroup from "./ConditionGroup";
import ConditionBlock from "./ConditionBlock";

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
  const [targetSection, setTargetSection] = useState<string>("");

  const [logicCondition, setLogicCondition] = useState<
    BaseCondition | ConditionGroupType
  >({
    fieldId: "", // default blank BaseCondition
    op: "equal",
    value: "",
  });

  useEffect(() => {
    const loadForm = async () => {
      if (!form_ID) return;

      const res = await getFormObject(form_ID);
      if (res.success && res.data?.sections) {
        const formSections = res.data.sections;
        setSections(formSections);

        const flowNodes: Node[] = formSections.map(
          (section: any, idx: any) => ({
            id: section.section_ID,
            type: "custom",
            position: { x: 300 * idx, y: 100 },
            data: {
              label: section.title || `Section ${idx + 1}`,
              id: section.section_ID,
              onClick: handleOpenModal,
            },
          })
        );

        setNodes(flowNodes);

        if (res.data.logic) {
          setLogicRules(res.data.logic);
        }
      } else {
        toast.error("Failed to load form.");
      }
    };

    loadForm();
  }, [form_ID]);

  function renderCondition(condition: NestedCondition | BaseCondition): string {
    if (!condition) return "";

    if ("fieldId" in condition) {
      return `${condition.fieldId} == ${condition.value}`;
    }

    if (
      "conditions" in condition &&
      Array.isArray(condition.conditions) &&
      condition.conditions.length > 0
    ) {
      const rendered = condition.conditions
        .map(renderCondition)
        .join(` ${condition.op} `);
      return `(${rendered})`;
    }

    return "";
  }

  useEffect(() => {
    const flowEdges: Edge[] = logicRules.map((rule, idx) => ({
      id: `e-${rule.triggerSectionId}-${rule.action.to}-${idx}`,
      source: rule.triggerSectionId,
      target: rule.action.to,
      animated: true,
      label: renderCondition(rule.action.condition),
      labelStyle: { fontSize: 12 },
    }));

    setEdges(flowEdges);
  }, [logicRules]);

  const formatCondition = (cond: NestedCondition): string => {
    return cond.conditions
      .map((c) => {
        if ("fieldId" in c) {
          return `${c.fieldId} == ${c.value}`;
        } else {
          return `(${formatCondition(c)})`;
        }
      })
      .join(` ${cond.op} `);
  };

  const handleOpenModal = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    setShowModal(true);
    setTargetSection("");

    const firstQuestion = sections.find((s) => s.section_ID === sectionId)
      ?.questions?.[0];

    setLogicCondition({
      fieldId: firstQuestion?.question_ID || "",
      op: "equal",
      value: "",
    });
  };

  const handleAddLogic = async () => {
    if (
      !selectedSectionId ||
      !targetSection ||
      ("conditions" in logicCondition && logicCondition.conditions.length === 0)
    ) {
      toast.error("Please fill all fields");
      return;
    }

    const newRule: LogicRule = {
      triggerSectionId: selectedSectionId,
      action: {
        type: "jump",
        to: targetSection,
        condition: logicCondition,
      },
    };

    const updatedRules = [...logicRules, newRule];
    setLogicRules(updatedRules);
    setShowModal(false);

    const saveResult = await saveFormLogic(form_ID, updatedRules);
    if (!saveResult.success) {
      toast.error("Failed to save logic.");
    } else {
      toast.success("Logic saved!");
    }
  };

  const handleDeleteLogic = async (indexToDelete: number) => {
    const updatedRules = logicRules.filter((_, idx) => idx !== indexToDelete);
    setLogicRules(updatedRules);

    const saveResult = await saveFormLogic(form_ID, updatedRules);
    if (!saveResult.success) {
      toast.error("Failed to delete logic.");
    } else {
      toast.success("Logic deleted.");
    }
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
            nodeTypes={nodeTypes}
            fitView
            style={{ background: "#FFF dark:#2B2A2A" }}
          >
            <Background />
            <MiniMap />
            <Controls />
          </ReactFlow>
        </ReactFlowProvider>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[1000px] max-h-[500px] overflow-auto shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Add Logic Condition</h2>

            {"fieldId" in logicCondition ? (
              <ConditionBlock
                allQuestions={selectedSection?.questions || []}
                condition={logicCondition}
                onChange={(newCond) => setLogicCondition(newCond)}
                onRemove={() => {}}
              />
            ) : (
              <ConditionGroup
                group={logicCondition}
                onUpdate={setLogicCondition}
                allQuestions={selectedSection?.questions || []}
              />
            )}

            {"fieldId" in logicCondition && (
              <button
                onClick={() =>
                  setLogicCondition({
                    op: "AND",
                    conditions: [logicCondition], // wrap existing block in group
                  })
                }
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                ➕ Convert to Group
              </button>
            )}

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

      <div className="px-2 mt-2 max-h-60 overflow-auto w-[300px]">
        <h3 className="text-sm dark:text-white font-medium mb-2">
          Saved Logic:
        </h3>
        <div className="space-y-1">
          {logicRules.map((rule, idx) => (
            <div
              key={idx}
              className="bg-[#E0E0E0] px-2 py-1 rounded text-sm break-words"
            >
              <p className="text-gray-700 mb-1 leading-snug">
                If section <strong>{rule.triggerSectionId}</strong> →{" "}
                <strong>{rule.action.to}</strong>
                <br />
                <em className="text-gray-600">
                  {renderCondition(rule.action.condition)}
                </em>
              </p>
              <button
                onClick={() => handleDeleteLogic(idx)}
                className="text-red-500 text-xs hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
