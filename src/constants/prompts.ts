export const generateQuestionnairePrompt = (
  context: string,
  question: string
) => {
  return `You are an expert in clinical trials. Your task is to answer the following question based *only* on the provided context from a clinical trial protocol.

# Context
${context}

# Question
${question}

# Answer
Provide a clear and concise answer to the question based on the context. If the context does not contain the answer, state that the information is not available in the provided document sections. Do not make assumptions or use external knowledge.
`;
};
