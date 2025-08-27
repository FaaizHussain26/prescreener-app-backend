export const generateQuestionnairePrompt = (
  context: string,
) => {
  return `You are an expert in clinical trials. Your task is to answer the following question based *only* on the provided context from a clinical trial protocol.

# Context
${context}

Generate a questionnaire based on the provided context from a clinical trial protocol Always include basic questions age, gender, any history of the patient, any allergies, any medications, any other relevant information.
`;
};
