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
import { useRef } from "react";

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
  SectionForm,
  NestedLogic,
  BaseLogic,
  SectionLogics,
  Always,
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

  // Track explicitly deleted always rules to prevent recreation
  const deletedAlwaysRef = useRef<Set<string>>(new Set());

  // Navigation stack for section traversal - now properly managed
  const [navigationStack, setNavigationStack] = useState<string[]>([]);

  const [sections, setSections] = useState<Section[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [logicRules, setLogicRules] = useState<SectionLogics[]>([]);

  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [targetSection, setTargetSection] = useState("");
  const [showSavedLogic, setShowSavedLogic] = useState(true);
  const [fallbackSectionId, setFallbackSectionId] = useState<string>("");
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [hasCondition, setHasCondition] = useState(false);

  const [logicCondition, setLogicCondition] = useState<
    SectionLogics["conditions"]
  >({
    op: "equal",
    questionID: "",
    value: "",
  });

  // Initialize navigation stack on form load
  useEffect(() => {
    if (form?.sections?.length > 0 && navigationStack.length === 0) {
      setNavigationStack([form.sections[0].section_ID]);
    }
  }, [form?.sections, navigationStack.length]);

  // Helper function to check if navigating to a previous section
  const isNavigatingToPrevious = (targetSectionId: string): boolean => {
    return navigationStack.includes(targetSectionId);
  };

  // Helper function to get previous section from stack
  const getPreviousFromStack = (): string | null => {
    if (navigationStack.length <= 1) return null;
    return navigationStack[navigationStack.length - 2] || null;
  };

  // Load deleted always rules from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`deletedAlways_${form?.form_ID}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          deletedAlwaysRef.current = new Set(parsed);
        } catch (e) {
          console.warn("Failed to parse stored deleted always rules" + e);
        }
      }
    }
  }, [form?.form_ID]);

  // Save deleted always rules to localStorage
  const saveDeletedAlwaysRules = () => {
    if (typeof window !== "undefined" && form?.form_ID) {
      localStorage.setItem(
        `deletedAlways_${form.form_ID}`,
        JSON.stringify([...deletedAlwaysRef.current])
      );
    }
  };

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

    const extractedRules: SectionLogics[] = formSections.flatMap((sec) =>
      (sec.logic || []).map((rule) => ({
        ...rule,
        conditions:
          rule.conditions ??
          ({
            op: "always",
            sourceSectionId: rule.fromSectionId,
          } as const),
      }))
    );

    const sectionIdsWithRules = new Set(
      extractedRules.map((r) => r.fromSectionId)
    );

    const defaultFallbackRules: SectionLogics[] = formSections
      .map((sec, idx) => {
        if (sectionIdsWithRules.has(sec.section_ID)) return null;
        if (deletedAlwaysRef.current.has(sec.section_ID)) return null;
        const next = formSections[idx + 1];
        if (!next) return null;
        return {
          fromSectionId: sec.section_ID,
          targetSectionId: next.section_ID,
          conditions: {
            op: "always",
            sourceSectionId: sec.section_ID,
          },
        };
      })
      .filter(Boolean) as SectionLogics[];

    const allRules = [...extractedRules, ...defaultFallbackRules];
    setLogicRules(allRules);

    // ✅ SAVE TO DB IF DEFAULT FALLBACKS WERE CREATED
    if (defaultFallbackRules.length > 0) {
      saveFormLogic(form.form_ID, allRules).then((res) => {
        if (!res.success) toast.error("Failed to save default logic");
        else toast.success("Default fallback logic auto-added!");
      });

      // ✅ Update the section objects with logic field as well
      const newSecs = formSections.map((sec) => {
        const rules = allRules.filter(
          (r) => r.fromSectionId === sec.section_ID
        );
        return { ...sec, logic: rules };
      });

      setForm({ ...form, sections: newSecs });
    }
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
          rule.conditions?.op === "always"
            ? "(Always go to)"
            : renderCondition(rule.conditions),
        labelStyle: { fontSize: 12 },
      });

      // For non-always rules, show fallback info in edge style
      if (rule.conditions?.op !== "always") {
        const prevSection = getPreviousFromStack();
        const fallbackLabel = prevSection
          ? `(fallback: ${prevSection})`
          : "(fallback: stack-based)";

        newEdges.push({
          id: `fallback-${rule.fromSectionId}-${idx}`,
          source: rule.fromSectionId,
          target: prevSection || rule.fromSectionId, // Self-loop if no previous
          animated: false,
          style: { strokeDasharray: "5,5", stroke: "#888" },
          label: fallbackLabel,
          labelStyle: { fontSize: 12, fill: "#888" },
        });
      }
    });

    setEdges(newEdges);
  }, [logicRules, navigationStack]);

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

    // Set fallback section value if any always rule from this section exists
    const alwaysRule = logicRules.find(
      (r) => r.fromSectionId === secId && r.conditions?.op === "always"
    );
    setFallbackSectionId(alwaysRule?.targetSectionId || "");
  };

  const handleAddLogic = async () => {
    if (!selectedSectionId || (!targetSection && !fallbackSectionId)) {
      toast.error("Please select a target or fallback section.");
      return;
    }

    const updatedLogicRules = [...logicRules];

    // Add conditional rule if selected
    if (targetSection) {
      const alreadyExists = updatedLogicRules.some(
        (r) =>
          r.fromSectionId === selectedSectionId &&
          r.targetSectionId === targetSection &&
          JSON.stringify(r.conditions) === JSON.stringify(logicCondition)
      );
      if (!alreadyExists) {
        updatedLogicRules.push({
          fromSectionId: selectedSectionId,
          targetSectionId: targetSection,
          conditions: logicCondition,
        });
      }
    }

    // Add fallback rule if selected
    if (fallbackSectionId) {
      const fallbackExists = updatedLogicRules.some(
        (r) =>
          r.fromSectionId === selectedSectionId &&
          r.targetSectionId === fallbackSectionId &&
          r.conditions?.op === "always"
      );
      if (!fallbackExists) {
        updatedLogicRules.push({
          fromSectionId: selectedSectionId,
          targetSectionId: fallbackSectionId,
          conditions: {
            op: "always",
            sourceSectionId: selectedSectionId,
          },
        });
      }
    }

    setLogicRules(updatedLogicRules);
    setShowModal(false);
    setHasCondition(false);

    const saveRes = await saveFormLogic(form.form_ID, updatedLogicRules);
    if (!saveRes.success) {
      toast.error("Failed to save logic.");
      return;
    }
    toast.success("Logic saved!");

    // ✅ Update logic in sections without overwriting unrelated rules
    const newSecs = sections.map((sec) => {
      const rulesFromThisSection = updatedLogicRules.filter(
        (r) => r.fromSectionId === sec.section_ID
      );
      return { ...sec, logic: rulesFromThisSection };
    });

    setForm({ ...form, sections: newSecs });
  };

  const handleDeleteLogic = async (idxToDel: number) => {
    const ruleToDelete = logicRules[idxToDel];
    if (!ruleToDelete) return;

    if (ruleToDelete.conditions?.op === "always") {
      deletedAlwaysRef.current.add(ruleToDelete.fromSectionId);
      saveDeletedAlwaysRules();
    }

    const updatedRules = logicRules.filter((_, i) => i !== idxToDel);
    setLogicRules(updatedRules);

    const newSecs = sections.map((sec) => {
      const rulesFromThisSection = updatedRules.filter(
        (r) => r.fromSectionId === sec.section_ID
      );
      return { ...sec, logic: rulesFromThisSection };
    });

    const saveRes = await saveFormLogic(form.form_ID, updatedRules);
    if (!saveRes.success) {
      toast.error("Failed to delete logic.");
      return;
    }
    toast.success("Logic deleted.");

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

  function isBaseLogic(
    cond: BaseLogic | NestedLogic | Always
  ): cond is BaseLogic {
    return "questionID" in cond && "value" in cond;
  }

  function isAlways(cond: BaseLogic | NestedLogic | Always): cond is Always {
    return cond.op === "always";
  }

  // Helper function to clear deleted always rules and regenerate defaults
  const clearDeletedAlwaysRules = () => {
    // Clear the tracking set
    deletedAlwaysRef.current.clear();

    // Remove from localStorage
    if (typeof window !== "undefined" && form?.form_ID) {
      localStorage.removeItem(`deletedAlways_${form.form_ID}`);
    }

    // Regenerate default "always" rules immediately
    if (form?.sections) {
      const formSections = form.sections;

      // Get existing conditional rules (non-always rules)
      const existingConditionalRules = logicRules.filter(
        (rule) => rule.conditions?.op !== "always"
      );

      // Generate new default fallback rules for all sections
      const newDefaultRules: SectionLogics[] = formSections
        .map((sec, idx) => {
          const next = formSections[idx + 1];
          if (!next) return null;

          return {
            fromSectionId: sec.section_ID,
            targetSectionId: next.section_ID,
            conditions: {
              op: "always",
              sourceSectionId: sec.section_ID,
            } as Always,
          };
        })
        .filter(Boolean) as SectionLogics[];

      // Combine existing conditional rules with new default rules
      const updatedRules = [...existingConditionalRules, ...newDefaultRules];
      setLogicRules(updatedRules);

      toast.success(
        "Reset complete! Default 'always' rules have been restored."
      );
    }
  };

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

          {/* Navigation Stack Display */}
          <div className="mb-4 p-2 bg-gray-100 dark:bg-gray-700 rounded">
            <h4 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
              Navigation Stack:
            </h4>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {navigationStack.length > 0
                ? navigationStack.join(" → ")
                : "Empty"}
            </div>
            <div className="mt-1">
              <span className="text-xs text-blue-600 dark:text-blue-400">
                Previous: {getPreviousFromStack() || "None"}
              </span>
            </div>
          </div>

          {/* Debug button - remove in production */}
          <div className="mb-4">
            <button
              onClick={clearDeletedAlwaysRules}
              className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
            >
              Reset Default Deleted Rules
            </button>
          </div>

          <div className="space-y-1">
            {logicRules.map((rule, idx) => (
              <div key={idx} className="rounded bg-[#E0E0E0] px-2 py-1 text-sm">
                <p className="mb-1 leading-snug text-gray-700">
                  <strong>{rule.fromSectionId}</strong> →{" "}
                  <strong>{rule.targetSectionId}</strong>
                  <br />
                  <em className="text-gray-600">
                    {rule.conditions?.op === "always"
                      ? "(Always go to)"
                      : renderCondition(rule.conditions)}
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
          <div className="max-h-[600px] w-[1000px] overflow-auto rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-black">
              Add Logic for: {selectedSection?.title || selectedSectionId}
            </h2>

            {/* Debug Information */}
            {/* <div className="mb-4 p-3 bg-blue-50 rounded text-sm">
              <h4 className="font-medium text-blue-800 mb-2">
                Debug Information:
              </h4>
              <div className="text-blue-700">
                <p>
                  <strong>Current Section:</strong> {selectedSectionId}
                </p>
                <p>
                  <strong>Available Questions:</strong>{" "}
                  {selectedSection?.questions?.length || 0}
                </p>
                {selectedSection?.questions?.map((q) => (
                  <div key={q.question_ID} className="ml-4 text-xs">
                    • {q.question_ID}: {q.questionText}
                  </div>
                ))}
                <p>
                  <strong>Other Sections:</strong>{" "}
                  {otherSections.map((s) => s.section_ID).join(", ")}
                </p>
              </div>
            </div> */}

            {/* Conditional Logic Section */}
            <div className="mb-6 p-4 border rounded bg-gray-50 [&_*]:!text-black [&_*]:!bg-white [&_button]:!bg-blue-50 [&_button:hover]:!bg-blue-100 [&_select]:!bg-white [&_select]:!text-black [&_input]:!bg-white [&_input]:!text-black [&_label]:!text-black">
              <h3 className="text-md font-medium !text-black mb-3">
                Conditional Navigation
              </h3>

              {!hasCondition ? (
                <button
                  onClick={() => {
                    setHasCondition(true);
                    const firstQ = selectedSection?.questions?.[0];
                    if (firstQ) {
                      setLogicCondition({
                        op: "equal",
                        questionID: firstQ.question_ID,
                        value: "",
                      });
                    }
                  }}
                  className="text-sm !text-blue-600 hover:underline !bg-blue-50 hover:!bg-blue-100 px-3 py-1 rounded transition-colors"
                >
                  ➕ Add Conditional Rule
                </button>
              ) : (
                <>
                  {!isAlways(logicCondition) && isBaseLogic(logicCondition) ? (
                    <div className="[&_*]:!text-black [&_select]:!bg-white [&_input]:!bg-white [&_button]:!bg-red-50 [&_button]:!text-red-600">
                      <ConditionBlock
                        allQuestions={selectedSection?.questions || []}
                        condition={logicCondition}
                        onChange={setLogicCondition}
                        onRemove={() => setHasCondition(false)}
                      />
                    </div>
                  ) : !isAlways(logicCondition) ? (
                    <div className="[&_*]:!text-black [&_select]:!bg-white [&_input]:!bg-white [&_button]:!bg-blue-50">
                      <ConditionGroup
                        group={logicCondition}
                        allQuestions={selectedSection?.questions || []}
                        onUpdate={setLogicCondition}
                      />
                    </div>
                  ) : (
                    <p className="text-sm !text-gray-500">
                      &quot;Always&quot; logic cannot be edited here.
                    </p>
                  )}

                  {isBaseLogic(logicCondition) && (
                    <button
                      onClick={() =>
                        setLogicCondition({
                          op: "AND",
                          conditions: [logicCondition],
                        })
                      }
                      className="mt-2 text-sm !text-blue-600 hover:underline !bg-transparent"
                    >
                      ➕ Convert to Group (AND/OR)
                    </button>
                  )}

                  <div className="!text-black mb-3 mt-4">
                    <label className="mb-1 block text-sm font-medium !text-black">
                      If conditions are met, go to:
                    </label>
                    <select
                      className="w-full rounded border px-2 py-1 !bg-white !text-black"
                      value={targetSection}
                      onChange={(e) => setTargetSection(e.target.value)}
                    >
                      <option value="">Select destination section</option>
                      {otherSections.map((s) => (
                        <option key={s.section_ID} value={s.section_ID}>
                          {s.title || s.section_ID}
                          {isNavigatingToPrevious(s.section_ID)}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Always/Fallback Logic Section */}
            <div className="mb-6 p-4 border rounded bg-yellow-50">
              <h3 className="text-md font-medium text-black mb-3">
                Always Go To
              </h3>
              <p className="text-xs text-gray-600 mb-3">
                This rule executes when no conditional rules match, or as a
                default path.
              </p>

              <div className="text-black">
                <label className="mb-1 block text-sm font-medium">
                  Default destination:
                </label>
                <select
                  className="w-full rounded border px-2 py-1"
                  value={fallbackSectionId}
                  onChange={(e) => setFallbackSectionId(e.target.value)}
                >
                  <option value="">(Use next section in sequence)</option>
                  {otherSections.map((s) => (
                    <option key={s.section_ID} value={s.section_ID}>
                      {s.title || s.section_ID}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  If not set, will navigate to the next section in sequence
                </p>
              </div>
            </div>

            {/* Debug Info */}
            <div className="mb-4 p-2 bg-gray-100 rounded text-xs text-black">
              <strong>Current Logic Rules for this section:</strong>
              <ul className="mt-1">
                {logicRules
                  .filter((r) => r.fromSectionId === selectedSectionId)
                  .map((rule, idx) => (
                    <li key={idx} className="text-gray-600">
                      → {rule.targetSectionId}(
                      {rule.conditions?.op === "always"
                        ? "Always"
                        : "Conditional"}
                      )
                    </li>
                  ))}
              </ul>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setHasCondition(false);
                }}
                className="text-black rounded border border-black px-3 py-1 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLogic}
                className="rounded bg-blue-600 px-4 py-1 text-sm text-white hover:bg-blue-700"
              >
                Save Logic Rules
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
