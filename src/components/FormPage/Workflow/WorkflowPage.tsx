"use client";

import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import getFormObject from "@/app/action/getFormObject";
import { Grip } from "lucide-react";
import { useWindowSize } from "react-use";
import { useReactFlow } from "reactflow";

import {
  LogicRule,
  Section,
  ConditionGroupType,
  NestedCondition,
  BaseCondition,
  Question,
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
} from "reactflow";

import CustomNode from "./CustomNode";
import { saveFormLogic } from "@/app/action/saveFormLogic";
import ConditionGroup from "./ConditionGroup";
import ConditionBlock from "./ConditionBlock";
enum sectionform {
  Build,
  Workflow,
  Preview,
}
interface formbuild {
  currentSection: sectionform;
  setCurrentSection: (section: sectionform) => void;
}
interface WorkflowPageProps extends formbuild {
  form_ID: string;
}

export default function WorkflowPage({
  form_ID,
  currentSection,
  setCurrentSection,
}: WorkflowPageProps) {
  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);
  const LABELS = ["Builder", "Workflow", "Preview"];

  const [showSavedLogic, setShowSavedLogic] = useState(true);

  const [sections, setSections] = useState<Section[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [logicRules, setLogicRules] = useState<LogicRule[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [targetSection, setTargetSection] = useState<string>("");
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);

  const [logicCondition, setLogicCondition] = useState<
    BaseCondition | ConditionGroupType
  >({
    fieldId: "", // default blank BaseCondition
    op: "equal",
    value: "",
  });

  useEffect(() => {
    const flatQuestions = sections.flatMap(
      (section) => section.questions || []
    );
    setAllQuestions(flatQuestions);
  }, [sections]);

  const generateRandomPosition = (index: number) => {
    const baseX = 0;
    const baseY = 200;
    const offsetX = Math.floor(Math.random() * 10);
    const offsetY = Math.floor(Math.random() * 100);
    return {
      x: baseX * index + offsetX,
      y: baseY * index + offsetY,
    };
  };

  function getQuestionText(question_ID: string): string {
    return (
      allQuestions.find((q) => q.question_ID === question_ID)?.questionText ||
      question_ID
    );
  }

  useEffect(() => {
    const loadForm = async () => {
      if (!form_ID) return;

      const res = await getFormObject(form_ID);
      if (res.success && res.data?.sections) {
        const formSections = res.data.sections;
        setSections(formSections);

        const flowNodes: Node[] = formSections.map((section: Section, idx: number) => {
          const pos = generateRandomPosition(idx);
          return {
            id: section.section_ID,
            type: "custom",
            position: pos,
            data: {
              label: section.title || `Section ${idx + 1}`,
              id: section.section_ID,
              onClick: handleOpenModal,
            },
          };
        });

        setNodes(flowNodes);

        // Extract logic from each section that has it
        const extractedLogicRules = formSections.flatMap((section: Section) =>
          (section.logic || []).map((logic: LogicRule) => ({
            ...logic,
            triggerSectionId: section.section_ID,
          }))
        );

        setLogicRules(extractedLogicRules);
      } else {
        toast.error("Failed to load form.");
      }
    };

    loadForm();
  }, [form_ID]);

  function renderCondition(condition: NestedCondition | BaseCondition): string {
    if (!condition) return "";

    if ("fieldId" in condition) {
      return `${getQuestionText(condition.fieldId)} == ${condition.value}`;
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

  // const formatCondition = (cond: NestedCondition): string => {
  //   return cond.conditions
  //     .map((c) => {
  //       if ("fieldId" in c) {
  //         return `${getQuestionText(c.fieldId)} == ${c.value}`;
  //       } else {
  //         return `(${formatCondition(c)})`;
  //       }
  //     })
  //     .join(` ${cond.op} `);
  // };

  const handleOpenModal = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    setShowModal(true);
    setTargetSection("");

    const firstQuestion = sections.find((s) => s.section_ID === sectionId)
      ?.questions?.[0];

    setLogicCondition({
      fieldId: firstQuestion?.questionText || "",
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

  function MiniMapDimensions() {
    const { width } = useWindowSize();
    let miniMapWidth = 160;
    let miniMapHeight = 120;

    if (width < 500) {
      miniMapWidth = 100;
      miniMapHeight = 80;
    } else if (width > 1000) {
      miniMapWidth = 200;
      miniMapHeight = 150;
    }

    return {
      width: miniMapWidth,
      height: miniMapHeight,
    };
  }

  function AutoCenter() {
    const { width } = useWindowSize();
    const { fitView } = useReactFlow();

    // Auto-center nodes when screen size changes (like switching to mobile)
    useEffect(() => {
      if (width < 768) {
        // Small screen — refit view
        const timeout = setTimeout(() => {
          fitView({ padding: 0.2, duration: 500 });
        }, 200); // slight delay to wait for DOM layout

        return () => clearTimeout(timeout);
      }
    }, [width, fitView]);

    return null;
  }

  const { width, height } = MiniMapDimensions();

  return (
    <div className="text-black w-full h-[90vh] p-4 flex gap-6">
      <div className="fixed top-[90px] left-1/2 -translate-x-1/2 z-40 w-full flex justify-center px-4 sm:px-0">
        <div className="flex justify-between items-center w-full max-w-[480px] h-[68px] rounded-[10px] dark:bg-[#414141] bg-[#91C4AB]/45 shadow px-2 sm:px-4">
          {LABELS.map((label, i) => (
            <button
              key={label}
              onClick={() => setCurrentSection(i as sectionform)}
              className={`flex-1 mx-1 text-[14px] sm:text-[16px] py-2 rounded-[7px] transition-colors duration-200 ${
                currentSection === i
                  ? "bg-[#61A986] text-black dark:text-white"
                  : "text-black dark:text-white hover:bg-[#b9d9c8] dark:hover:bg-[#353434]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
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
            defaultEdgeOptions={{
              style: { stroke: "#999" },
              labelBgStyle: { fill: "#fff", color: "#000", fillOpacity: 0.9 },
              labelBgPadding: [6, 4],
              labelBgBorderRadius: 4,
              labelStyle: { fontSize: 12 }, // ✅ Works inside labelBgStyle/labelStyle now
            }}
            fitView
          >
            <Background />
            <MiniMap
              pannable={true}
              style={{
                width: width,
                height: height,
              }}
            />
            <Controls />
            <AutoCenter />
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

      <div className="relative">
        {/* Hamburger Button - visible only on small screens */}
        <button
          className="md:hidden fixed top-20 ml-2 left-2 z-30 p-2 rounded  dark:bg-[#363535] bg-[#fefefe] text-black dark:text-white shadow mt-20"
          onClick={() => setShowSavedLogic((prev) => !prev)}
        >
          <Grip size={20} />
        </button>

        {/* Logic Sidebar */}
        <div
          className={`
          fixed top-0 left-0 h-full w-[75%] z-40 p-4 mt-20 md:mt-0 dark:bg-[#363535] bg-[#fefefe] md:bg-none overflow-y-auto transition-transform duration-300
          ${showSavedLogic ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:w-[300px]
        `}
        >
          <div className="flex justify-end mb-4 md:hidden">
            <button
              onClick={() => setShowSavedLogic(false)}
              className="text-red-500 font-semibold px-3 py-1 rounded hover:bg-red-500 hover:text-white transition"
            >
              Close
            </button>
          </div>

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
                  <strong>{rule.triggerSectionId}</strong> →{" "}
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
    </div>
  );
}
