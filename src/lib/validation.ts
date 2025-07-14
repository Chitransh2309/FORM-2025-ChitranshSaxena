import { Question, Answer, QuestionType, Validation, Param } from "@/lib/interface";

type ValidationResult = { isValid: boolean; errors: string[] };

export function validateAnswer(question: Question, answer: Answer | undefined): ValidationResult {
  const errors: string[] = [];
  const value = answer?.value ?? "";

  // Required check
  if (question.isRequired && !value.trim()) {
    errors.push(`${question.questionText} is required`);
    return { isValid: false, errors };
  }
  const validations: Validation[] = question.config?.validations || [];
  const getParam = (name: string) =>
    question.config?.params?.find((p: Param) => p.name === name)?.value;

  const getValidationParam = (validationName: string, paramName: string) => {
    const v = validations.find((v) => v.name === validationName);
    return v?.params?.find((p) => p.name === paramName)?.value;
  };

  switch (question.type) {
    case QuestionType.TEXT: {
      // Char limit
      const min = Number(getValidationParam("charlimit", "min")) ?? 0;
      const max = Number(getValidationParam("charlimit", "max")) ?? Infinity;
      if (min && value.length < min) {
        errors.push(`${question.questionText} must be at least ${min} characters`);
      }
      if (max && value.length > max) {
        errors.push(`${question.questionText} must be at most ${max} characters`);
      }
      // Keyword checker
      const contains = getValidationParam("keywordChecker", "contains");
      if (contains && Array.isArray(contains)) {
        for (const word of contains) {
          if (word && !value.includes(word)) {
            errors.push(`${question.questionText} must contain "${word}"`);
          }
        }
      }
      const doesnotContain = getValidationParam("keywordChecker", "doesnotContain");
      if (doesnotContain && Array.isArray(doesnotContain)) {
        for (const word of doesnotContain) {
          if (word && value.includes(word)) {
            errors.push(`${question.questionText} must not contain "${word}"`);
          }
        }
      }
      break;
    }
    case QuestionType.MCQ: {
      const min = Number(getParam("min")) ?? 0;
      const max = Number(getParam("max")) ?? Infinity;
      const selected = value.split(",").filter((v: string) => v.trim());
      if (min && selected.length < min) {
        errors.push(`${question.questionText} requires at least ${min} selection${min > 1 ? "s" : ""}`);
      }
      if (max && selected.length > max) {
        errors.push(`${question.questionText} allows at most ${max} selection${max > 1 ? "s" : ""}`);
      }
      break;
    }
    case QuestionType.DROPDOWN: {
      // No additional validation for now
      break;
    }
    case QuestionType.DATE: {
      const minDate = getValidationParam("dateRange", "minDate");
      const maxDate = getValidationParam("dateRange", "maxDate");
      if (value) {
        const dateValue = new Date(value);
        if (minDate && typeof minDate === 'string' && dateValue < new Date(minDate)) {
          errors.push(`${question.questionText} must be after ${minDate}`);
        }
        if (maxDate && typeof maxDate === 'string' && dateValue > new Date(maxDate)) {
          errors.push(`${question.questionText} must be before ${maxDate}`);
        }
      }
      break;
    }
    case QuestionType.EMAIL: {
      const regex = validations.find((v) => v.name === "regex")?.value as string;
      if (regex && value && !new RegExp(regex).test(value)) {
        errors.push(`${question.questionText} must be a valid email address`);
      }
      break;
    }
    case QuestionType.URL: {
      const regex = validations.find((v) => v.name === "regex")?.value as string;
      if (regex && value && !new RegExp(regex).test(value)) {
        errors.push(`${question.questionText} must be a valid URL`);
      }
      break;
    }
    case QuestionType.LINEARSCALE: {
      const min = Number(getParam("min")) ?? 1;
      const max = Number(getParam("max")) ?? 5;
      const numValue = Number(value);
      if (numValue < min || numValue > max) {
        errors.push(`${question.questionText} must be between ${min} and ${max}`);
      }
      break;
    }
    default:
      break;
  }

  return { isValid: errors.length === 0, errors };
}
