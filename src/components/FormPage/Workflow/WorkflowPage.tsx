/* --------------------------------------------------------------------------
 * WorkflowPage.tsx
 * Renders the Workflow tab (logic graph editor) for a form.
 * Relies entirely on the `form` object passed down from the parent and
 * keeps the parent copy in-sync through `setForm`.
 * ------------------------------------------------------------------------ */
"use client";

import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { Grip } from "lucide-react";
import { useWindowSize } from "react-use";

import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";

import CustomNode from "./CustomNode";
import ConditionBlock from "./ConditionBlock";
import ConditionGroup from "./ConditionGroup";
import { saveFormLogic } from "@/app/action/saveFormLogic";

import type {
  Form,
  Section,
  Question,
  LogicRule,
  SectionForm,
  NestedLogic,
  BaseLogic,
  SectionLogics,
} from "@/lib/interface";

interface WorkflowPageProps {
  form: Form;
  setForm: (f: Form) => void;
  currentSection: SectionForm;
  setCurrentSection: (s: SectionForm) => void;
}

export default function WorkflowPage({
  form,
  setForm,
  currentSection,
  setCurrentSection,
}: WorkflowPageProps) {
  const LABELS = ["Builder", "Workflow", "Preview"];
  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  const [sections, setSections] = useState<Section[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [logicRules, setLogicRules] = useState<LogicRule[]>([]);

  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [targetSection, setTargetSection] = useState("");
  const [showSavedLogic, setShowSavedLogic] = useState(true);
  const [fallbackSectionId, setFallbackSectionId] = useState<string>("");
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [logicCondition, setLogicCondition] = useState<
    SectionLogics["conditions"]
  >({
    op: "equal",
    questionID: "",
    value: "",
  });

  useEffect(() => {
    if (!form) return;

    const formSections = form.sections || [];
    setSections(formSections);
    setAllQuestions(formSections.flatMap((sec) => sec.questions || []));

    const nodesFromSections: Node[] = formSections.map((sec, idx) => ({
      id: sec.section_ID,
      type: "custom",
      position: {
        x: idx * 0 + Math.random() * 10,
        y: 200 * idx + Math.random() * 100,
      },
      data: {
        label: sec.title || `Section ${idx + 1}`,
        id: sec.section_ID,
        onClick: handleOpenModal,
      },
    }));
    setNodes(nodesFromSections);

    const extractedRules: LogicRule[] = formSections.flatMap((sec) =>
      (sec.logic || []).map((rule) => ({ ...rule }))
    );
    setLogicRules(extractedRules);
  }, [form]);

  const getQuestionText = (id: string) =>
    allQuestions.find((q) => q.question_ID === id)?.questionText || id;

  const renderCondition = (c: NestedLogic | BaseLogic): string => {
    if (!c) return "";

    if ("questionID" in c) {
      return `${getQuestionText((c as BaseLogic).questionID)} == ${
        (c as BaseLogic).value
      }`;
    }

    if ("conditions" in c && c.conditions.length) {
      return `(${(c as NestedLogic).conditions
        .map(renderCondition)
        .join(` ${c.op} `)})`;
    }

    return "";
  };

  useEffect(() => {
    const newEdges: Edge[] = [];

    logicRules.forEach((rule, idx) => {
      // Main conditional path
      newEdges.push({
        id: `e-${rule.fromSectionId}-${rule.targetSectionId}-${idx}`,
        source: rule.fromSectionId,
        target: rule.targetSectionId,
        animated: true,
        label:
          rule.condition && "conditions" in rule.condition
            ? renderCondition(rule.condition.conditions)
            : "(No logic defined)",
        labelStyle: { fontSize: 12 },
      });

      // Fallback path (dashed)
      if (rule.fallbackTargetSectionId) {
        newEdges.push({
          id: `fallback-${rule.fromSectionId}-${rule.fallbackTargetSectionId}-${idx}`,
          source: rule.fromSectionId,
          target: rule.fallbackTargetSectionId,
          animated: false,
          style: { strokeDasharray: "5,5", stroke: "#888" },
          label: "(always goes to)",
          labelStyle: { fontSize: 12, fill: "#888" },
        });
      }
    });

    setEdges(newEdges);
  }, [logicRules]);

  const handleOpenModal = (secId: string) => {
    setSelectedSectionId(secId);
    setShowModal(true);
    setTargetSection("");

    const firstQ = sections.find((s) => s.section_ID === secId)?.questions?.[0];
    setLogicCondition({
      op: "equal",
      questionID: firstQ?.question_ID || "",
      value: "",
    });

    // 🟢 Set fallback section value if any rule from this section already has it
    const existingRule = logicRules.find(
      (r) => r.fromSectionId === secId && r.fallbackTargetSectionId
    );
    console.log(existingRule);
    setFallbackSectionId(existingRule?.fallbackTargetSectionId || "");
  };

  const handleAddLogic = async () => {
    if (!selectedSectionId || (!targetSection && !fallbackSectionId)) {
      toast.error("Please select a target or fallback section.");
      return;
    }

    // Step 1: Update fallback on all related rules
    const updatedLogicRules = logicRules.map((rule) => {
      if (rule.fromSectionId === selectedSectionId) {
        return {
          ...rule,
          fallbackTargetSectionId:
            fallbackSectionId || rule.fallbackTargetSectionId,
        };
      }
      return rule;
    });

    // ✅ Step 2: Add the new rule (only include condition if it exists)
    const newRule: LogicRule = {
      fromSectionId: selectedSectionId,
      targetSectionId: targetSection,
      ...(logicCondition && {
        condition: {
          conditions: logicCondition,
        },
      }),
      ...(fallbackSectionId && { fallbackTargetSectionId: fallbackSectionId }),
    };

    const finalRules = [...updatedLogicRules, newRule];
    setLogicRules(finalRules);
    setShowModal(false);

    // Step 3: Save
    const saveRes = await saveFormLogic(form.form_ID, finalRules);
    if (!saveRes.success) {
      toast.error("Failed to save logic.");
      return;
    }
    toast.success("Logic saved!");

    // Step 4: Update section logic for all affected destination sections
    const newSecs = sections.map((sec) => {
      const relevantRules = finalRules.filter(
        (rule) => rule.targetSectionId === sec.section_ID
      );
      return relevantRules.length > 0 ? { ...sec, logic: relevantRules } : sec;
    });

    setForm({ ...form, sections: newSecs });
  };
  const handleDeleteLogic = async (idxToDel: number) => {
    const updatedRules = logicRules.filter((_, i) => i !== idxToDel);
    setLogicRules(updatedRules);

    const saveRes = await saveFormLogic(form.form_ID, updatedRules);
    if (!saveRes.success) {
      toast.error("Failed to delete logic.");
      return;
    }
    toast.success("Logic deleted.");

    const rule = logicRules[idxToDel];
    const newSecs = sections.map((sec) =>
      sec.section_ID === rule.targetSectionId
        ? {
            ...sec,
            logic: (sec.logic || []).filter((_, i) => i !== idxToDel),
          }
        : sec
    );
    setForm({ ...form, sections: newSecs });
  };

  const { width: winW } = useWindowSize();
  const mapSize = {
    width: winW < 500 ? 100 : winW > 1000 ? 200 : 160,
    height: winW < 500 ? 80 : winW > 1000 ? 150 : 120,
  };

  function AutoCenter() {
    const { fitView } = useReactFlow();
    useEffect(() => {
      if (winW < 768) {
        const t = setTimeout(
          () => fitView({ padding: 0.2, duration: 500 }),
          200
        );
        return () => clearTimeout(t);
      }
    }, [winW, fitView]);
    return null;
  }

  const selectedSection = sections.find(
    (s) => s.section_ID === selectedSectionId
  );
  const otherSections = sections.filter(
    (s) => s.section_ID !== selectedSectionId
  );

  function isBaseLogic(cond: BaseLogic | NestedLogic): cond is BaseLogic {
    return "questionID" in cond && "value" in cond;
  }

  return (
    <div className="w-full h-[90vh] p-4 flex gap-6 dark:bg-[#2B2A2A]">
      <div className="fixed top-[90px] left-1/2 -translate-x-1/2 z-40 w-full px-4">
        <div className="mx-auto flex w-full max-w-[480px] h-[68px] items-center justify-between rounded-[10px] bg-[#91C4AB]/45 px-2 shadow dark:bg-[#414141]">
          {LABELS.map((l, i) => (
            <button
              key={l}
              onClick={() => setCurrentSection(i as SectionForm)}
              className={`flex-1 mx-1 py-2 rounded-[7px] text-sm sm:text-base transition-colors ${
                currentSection === i
                  ? "bg-[#61A986] text-black dark:text-white"
                  : "text-black hover:bg-[#b9d9c8] dark:text-white dark:hover:bg-[#353434]"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 rounded-md">
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={(c) => setNodes((nds) => applyNodeChanges(c, nds))}
            onEdgesChange={(c) => setEdges((eds) => applyEdgeChanges(c, eds))}
            defaultEdgeOptions={{
              style: { stroke: "#999" },
              labelBgStyle: { fill: "#fff", color: "#000", fillOpacity: 0.9 },
              labelBgPadding: [6, 4],
              labelBgBorderRadius: 4,
              labelStyle: { fontSize: 12 },
            }}
            fitView
          >
            <Background />
            <MiniMap pannable style={mapSize} />
            <Controls />
            <AutoCenter />
          </ReactFlow>
        </ReactFlowProvider>
      </div>

      <div className="relative">
        <button
          className="xl:hidden fixed top-20 left-2 z-30 mt-20 rounded bg-[#fefefe] p-2 shadow dark:bg-[#363535] dark:text-white"
          onClick={() => setShowSavedLogic((p) => !p)}
        >
          <Grip size={20} />
        </button>

        <aside
          className={`fixed top-0 left-0 z-40 h-full w-[75%] overflow-y-auto p-4 shadow transition-transform duration-300 dark:bg-[#363535] bg-[#fefefe] mt-19 sm:mt-0 ${
            showSavedLogic ? "translate-x-0" : "-translate-x-full"
          } xl:relative xl:translate-x-0 xl:w-[300px] xl:bg-none`}
        >
          <div className="mb-4 flex justify-end xl:hidden">
            <button
              onClick={() => setShowSavedLogic(false)}
              className="rounded px-3 py-1 font-semibold text-red-500 transition hover:bg-red-500 hover:text-white"
            >
              Close
            </button>
          </div>

          <h3 className="mb-2 text-sm font-medium dark:text-white">
            Saved Logic
          </h3>
          <div className="space-y-1">
            {logicRules.map((rule, idx) => (
              <div key={idx} className="rounded bg-[#E0E0E0] px-2 py-1 text-sm">
                <p className="mb-1 leading-snug text-gray-700">
                  <strong>{rule.fromSectionId}</strong> →{" "}
                  <strong>{rule.targetSectionId}</strong>
                  <br />
                  <em className="text-gray-600">
                    {rule?.condition?.conditions
                      ? renderCondition(rule.condition.conditions)
                      : "(No logic defined)"}
                  </em>
                </p>
                <button
                  onClick={() => handleDeleteLogic(idx)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="max-h-[500px] w-[1000px] overflow-auto rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-black">
              Add Logic Condition
            </h2>

            {isBaseLogic(logicCondition) ? (
              <ConditionBlock
                allQuestions={selectedSection?.questions || []}
                condition={logicCondition}
                onChange={setLogicCondition}
                onRemove={() => {}}
              />
            ) : (
              <ConditionGroup
                group={logicCondition}
                allQuestions={selectedSection?.questions || []}
                onUpdate={setLogicCondition}
              />
            )}

            {logicCondition.op === "equal" && (
              <button
                onClick={() =>
                  setLogicCondition({
                    op: "AND",
                    conditions: [logicCondition],
                  })
                }
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                ➕ Convert to Group
              </button>
            )}

            <div className="text-black mb-3 mt-4">
              <label className="mb-1 block text-sm font-medium">
                Go to Section (if conditions pass)
              </label>
              <select
                className="w-full rounded border px-2 py-1"
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

            <div className="text-black mb-3 mt-4">
              <label className="mb-1 block text-sm font-medium">
                Always go to (if other conditions fail)
              </label>
              <select
                className="w-full rounded border px-2 py-1"
                value={fallbackSectionId}
                onChange={(e) => setFallbackSectionId(e.target.value)}
              >
                <option value="">(Optional)</option>
                {otherSections.map((s) => (
                  <option key={s.section_ID} value={s.section_ID}>
                    {s.title || s.section_ID}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="text-black rounded border border-black px-3 py-1 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLogic}
                className="rounded bg-blue-600 px-4 py-1 text-sm text-white hover:bg-blue-700"
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
