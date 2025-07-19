export interface User {
  user_ID: string;
  email: string;
  googleID: string;
  forms?: string[]; // form_ID references
  sharedForms?: string[];
  icon?: string;
  name: string;
  verified?: Date;
}

export interface Form {
  form_ID: string;
  title: string;
  description: string;
  createdAt: Date;
  createdBy: string; // user_ID reference
  editorID?: string[];
  viewerID?: string[];
  publishedAt?: Date | null;
  isActive: boolean;
  version: number;
  share_url: string;
  settings: FormSettings;
  sections: Section[];
  isDeleted: boolean;
  isStarred: boolean;
  responseCount?: number; // Optional, can be derived from responses
}
// // types/Section.ts
export enum SectionForm {
  Builder,
  Workflow,
  Preview,
}

// export type NestedCondition = {
//   op: "AND" | "OR";
//   conditions: (BaseCondition | NestedCondition)[];
// };

// export type LogicRule = {
//   triggerSectionId: string;
//   action: {
//     type: "jump";
//     to: string;
//     condition: NestedLogic | BaseLogic;
//   };
// };

// export type BaseCondition = {
//   fieldId: string;
//   op: "equal";
//   value: string;
// };
// export type ConditionGroupType = {
//   op: "AND" | "OR";
//   conditions: (BaseCondition | ConditionGroupType)[];
// };

export interface LogicRule {
  targetSectionId: string;
  fromSectionId: string;
  condition?: SectionLogics; // your existing AND/OR structure
  fallbackTargetSectionId?: string;
}

export interface SectionLogics {
  conditions: BaseLogic | NestedLogic;
}

export type NestedLogic = {
  op: "AND" | "OR";
  conditions: (NestedLogic | BaseLogic)[];
};

export interface BaseLogic {
  questionID: string;
  op: "equal";
  value: string | number;
}

export interface FormSettings {
  maxResponses?: number;
  startDate: Date;
  endDate?: Date;
  tab_switch_count?: boolean;
  timer?: number;
  autoSubmit?: boolean;
  cameraRequired: boolean;
  copy_via_email?: boolean;
  timingEnabled?: boolean;
}

export interface Section {
  section_ID: string;
  title: string;
  description: string;
  questions: Question[];
  logic?: LogicRule[];
}

export interface Question {
  question_ID: string;
  order: number;
  section_ID: string;
  type?: QuestionType;
  questionText: string;
  isRequired: boolean;
  config?: FieldType;
  image?: string;
  //logic?: Record<string, any>;
}

export enum QuestionType {
  TEXT = "TEXT",
  DATE = "DATE",
  MCQ = "MCQ",
  DROPDOWN = "DROPDOWN",
  FILE_UPLOAD = "FILE_UPLOAD",
  EMAIL = "EMAIL",
  URL = "URL",
  LINEARSCALE = "LINEARSCALE",
}

export interface FormResponse {
  response_ID: string;
  form_ID: string;
  userId: string;
  userName?: string; // Optional, can be derived from user_ID
  startedAt: Date;
  submittedAt: Date;
  status: string;
  answers: Answer[];
  //reportedFlags: ReportedFlag[];
  version: number;
}

export interface Answer {
  answer_ID: string;
  question_ID: string;
  value: string;
  isCorrect?: boolean;
  updatedAt: Date;
}

export interface ReportedFlag {
  reason: string;
  numTimesReported: number;
  flaggedBy: string;
  flaggedAt: Date;
}

export type ParamType =
  | "string"
  | "number"
  | "boolean"
  | "array[string]"
  | "file"
  | "date"
  | "checkBox";

export interface Param {
  name: string;
  type: ParamType; //
  value?: string | number | boolean | string[];
}

export interface Validation {
  name: string;
  type?: ParamType;
  params?: Param[];
  value?: string | number | boolean;
  validationName?: string;
}

export interface FieldType {
  name: string;
  type: ParamType;
  params: Param[];
  validations: Validation[];
}

export interface Contact {
  contact_ID: string;
  user_ID: string; // form_ID reference
  createdAt: Date;
  name: string;
  email: string;
  message: string;
}

export const fieldtypes: FieldType[] = [
  {
    name: "text",
    type: "string",
    params: [{ name: "placeholder", type: "string" }],
    validations: [
      {
        name: "charlimit",
        params: [
          { name: "max", type: "number" },
          { name: "min", type: "number" },
        ],
      },
      {
        name: "keywordChecker",
        params: [
          { name: "contains", type: "string" },
          { name: "doesnotContain", type: "string" },
        ],
      },
    ],
  },
  {
    name: "mcq",
    type: "checkBox",
    params: [
      { name: "options", type: "array[string]" },
      { name: "shuffle", type: "boolean" },
      { name: "min", type: "number" },
      { name: "max", type: "number" },
    ],
    validations: [],
  },
  {
    name: "dropdown",
    type: "string",
    params: [{ name: "options", type: "array[string]" }],
    validations: [],
  },
  {
    name: "date",
    type: "date",
    params: [{ name: "includeTime", type: "boolean" }],
    validations: [
      {
        name: "dateRange",
        params: [
          { name: "minDate", type: "date" },
          { name: "maxDate", type: "date" },
        ],
      },
    ],
  },
  {
    name: "linear_scale",
    type: "number",
    params: [
      { name: "min", type: "number" },
      { name: "max", type: "number" },
      { name: "minLabel", type: "string" },
      { name: "maxLabel", type: "string" },
    ],
    validations: [],
  },
  {
    name: "file_upload",
    type: "file",
    params: [
      { name: "allowedFileTypes", type: "array[string]" },
      { name: "maxFileSizeMB", type: "number" },
      { name: "maxFiles", type: "number" },
    ],
    validations: [],
  },
  {
    name: "email",
    type: "string",
    params: [],
    validations: [
      {
        name: "format",
        params: [{ name: "type", type: "string", value: "email" }],
      },
      {
        name: "regex",
        type: "string",
        value: "^[\\w.-]+@[\\w-]+(\\.[\\w-]+)+$",
      },
    ],
  },
  {
    name: "url",
    type: "string",
    params: [],
    validations: [
      {
        name: "regex",
        type: "string",
        value: "^(https?:\\/\\/)?([\\w\\d-]+\\.)+[\\w\\d]{2,}(\\/\\S*)?$",
      },
      {
        name: "format",
        params: [{ name: "type", type: "string", value: "url" }],
      },
    ],
  },
];
