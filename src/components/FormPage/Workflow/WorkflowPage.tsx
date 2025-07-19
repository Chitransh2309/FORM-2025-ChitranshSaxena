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

  // Helper function to add section to navigation stack
  const addToNavigationStack = (sectionId: string) => {
    setNavigationStack((prev) => {
      // Don't add if it's already the last item
      if (prev[prev.length - 1] === sectionId) return prev;
      return [...prev, sectionId];
    });
  };

  // Helper function to navigate to previous section in stack
  const navigateToPrevious = (targetSectionId: string) => {
    setNavigationStack((prev) => {
      const targetIndex = prev.indexOf(targetSectionId);
      if (targetIndex === -1) {
        // Target not in stack, add it
        return [...prev, targetSectionId];
      }
      // Pop all sections after target (going back to previous)
      return prev.slice(0, targetIndex + 1);
    });
  };

  // Helper function to check if navigating to a previous section
  const isNavigatingToPrevious = (targetSectionId: string): boolean => {
    return navigationStack.includes(targetSectionId);
  };

  // Helper function to get previous section from stack
  const getPreviousFromStack = (): string | null => {
    if (navigationStack.length <= 1) return null;
    return navigationStack[navigationStack.length - 2] || null;
  };

  // Create unique key for always rules to track deletions properly
  const createAlwaysRuleKey = (fromSectionId: string): string => {
    return `always_${fromSectionId}`;
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
          console.warn("Failed to parse stored deleted always rules");
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

    // Extract existing rules from form sections
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

    // Only add default fallbacks if:
    // 1. Section doesn't have any rules
    // 2. User hasn't explicitly deleted the always rule for this section
    // 3. There's a next section available
    const defaultFallbackRules: SectionLogics[] = formSections
      .map((sec, idx) => {
        const alwaysKey = createAlwaysRuleKey(sec.section_ID);

        // Skip if section already has rules
        if (sectionIdsWithRules.has(sec.section_ID)) return null;

        // Skip if user has deleted the always rule for this section
        if (deletedAlwaysRef.current.has(alwaysKey)) return null;

        // Skip if no next section
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

    setLogicRules([...extractedRules, ...defaultFallbackRules]);
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
    if (!selectedSectionId) {
      toast.error("Please select a section first.");
      return;
    }

    if (!targetSection && !fallbackSectionId) {
      toast.error(
        "Please select at least one target section (conditional or fallback)."
      );
      return;
    }

    const updatedLogicRules = [...logicRules];

    // Remove all existing rules for this section first
    const filteredRules = updatedLogicRules.filter(
      (r) => r.fromSectionId !== selectedSectionId
    );

    // Add conditional rule if specified
    if (targetSection && hasCondition) {
      const conditionalRule: SectionLogics = {
        fromSectionId: selectedSectionId,
        targetSectionId: targetSection,
        conditions: logicCondition,
      };

      filteredRules.push(conditionalRule);
      console.log("Added conditional rule:", conditionalRule);
    }

    // Always add a fallback rule (either user-specified or default)
    let fallbackTargetId = fallbackSectionId;

    // If no fallback specified, use next section
    if (!fallbackTargetId) {
      const currentIndex = sections.findIndex(
        (s) => s.section_ID === selectedSectionId
      );
      if (currentIndex >= 0 && currentIndex < sections.length - 1) {
        fallbackTargetId = sections[currentIndex + 1].section_ID;
      }
    }

    if (fallbackTargetId) {
      const fallbackRule: SectionLogics = {
        fromSectionId: selectedSectionId,
        targetSectionId: fallbackTargetId,
        conditions: {
          op: "always",
          sourceSectionId: selectedSectionId,
        } as Always,
      };

      filteredRules.push(fallbackRule);
      console.log("Added/updated always rule:", fallbackRule);

      // Remove from deleted set if we're adding it back
      const alwaysKey = createAlwaysRuleKey(selectedSectionId);
      deletedAlwaysRef.current.delete(alwaysKey);
      saveDeletedAlwaysRules();
    }

    setLogicRules(filteredRules);
    setShowModal(false);
    setHasCondition(false);

    // Save to backend
    try {
      const saveRes = await saveFormLogic(form.form_ID, filteredRules);
      if (!saveRes.success) {
        toast.error("Failed to save logic.");
        return;
      }
      toast.success("Logic saved!");

      // Update form sections with the new logic rules
      const newSecs = sections.map((sec) => {
        const relevantRules = filteredRules.filter(
          (rule) => rule.fromSectionId === sec.section_ID
        );
        return { ...sec, logic: relevantRules };
      });

      setForm({ ...form, sections: newSecs });
      console.log("Updated sections with logic:", newSecs);
    } catch (error) {
      console.error("Error saving logic:", error);
      toast.error("Failed to save logic.");
    }
  };

  const handleDeleteLogic = async (idxToDel: number) => {
    const ruleToDelete = logicRules[idxToDel];
    if (!ruleToDelete) return;

    // If deleting an "always" rule, mark it as explicitly deleted
    if (ruleToDelete.conditions?.op === "always") {
      const alwaysKey = createAlwaysRuleKey(ruleToDelete.fromSectionId);
      deletedAlwaysRef.current.add(alwaysKey);
      saveDeletedAlwaysRules();
    }

    // Remove from local rules list
    const updatedRules = logicRules.filter((_, i) => i !== idxToDel);
    setLogicRules(updatedRules);

    try {
      // Save to backend
      const saveRes = await saveFormLogic(form.form_ID, updatedRules);
      if (!saveRes.success) {
        toast.error("Failed to delete logic.");
        // Revert local changes if save failed
        setLogicRules(logicRules);
        if (ruleToDelete.conditions?.op === "always") {
          const alwaysKey = createAlwaysRuleKey(ruleToDelete.fromSectionId);
          deletedAlwaysRef.current.delete(alwaysKey);
          saveDeletedAlwaysRules();
        }
        return;
      }

      toast.success("Logic deleted.");

      // Update form sections by removing the exact rule
      const newSecs = sections.map((sec) => {
        const remainingRules = updatedRules.filter(
          (rule) => rule.fromSectionId === sec.section_ID
        );
        return { ...sec, logic: remainingRules };
      });

      setForm({ ...form, sections: newSecs });
    } catch (error) {
      console.error("Error deleting logic:", error);
      toast.error("Failed to delete logic.");
      // Revert on error
      setLogicRules(logicRules);
    }
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
              Reset Deleted Rules (Debug)
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
            <div className="mb-4 p-3 bg-blue-50 rounded text-sm">
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
            </div>

            {/* Conditional Logic Section */}
            <div className="mb-6 p-4 border rounded bg-gray-50">
              <h3 className="text-md font-medium text-black mb-3">
                Conditional Navigation (Optional)
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
                  className="text-sm text-blue-600 hover:underline bg-blue-50 px-3 py-1 rounded"
                >
                  ➕ Add Conditional Rule
                </button>
              ) : (
                <>
                  {!isAlways(logicCondition) && isBaseLogic(logicCondition) ? (
                    <ConditionBlock
                      allQuestions={selectedSection?.questions || []}
                      condition={logicCondition}
                      onChange={setLogicCondition}
                      onRemove={() => setHasCondition(false)}
                    />
                  ) : !isAlways(logicCondition) ? (
                    <ConditionGroup
                      group={logicCondition}
                      allQuestions={selectedSection?.questions || []}
                      onUpdate={setLogicCondition}
                    />
                  ) : (
                    <p className="text-sm text-gray-500">
                      "Always" logic cannot be edited here.
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
                      className="mt-2 text-sm text-blue-600 hover:underline"
                    >
                      ➕ Convert to Group (AND/OR)
                    </button>
                  )}

                  <div className="text-black mb-3 mt-4">
                    <label className="mb-1 block text-sm font-medium">
                      If conditions are met, go to:
                    </label>
                    <select
                      className="w-full rounded border px-2 py-1"
                      value={targetSection}
                      onChange={(e) => setTargetSection(e.target.value)}
                    >
                      <option value="">Select destination section</option>
                      {otherSections.map((s) => (
                        <option key={s.section_ID} value={s.section_ID}>
                          {s.title || s.section_ID}
                          {isNavigatingToPrevious(s.section_ID)
                            ? " (Previous)"
                            : " (Forward)"}
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
                Fallback Navigation (Always Execute)
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
            <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
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
