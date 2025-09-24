export const generateQuestionnairePrompt = (context: string) => {
  return `You are an expert in clinical trials. Your task is to answer the following question based *only* on the provided context from a clinical trial protocol.

# Context
${context}

Generate a questionnaire based on the provided context from a clinical trial protocol Always include basic questions age, gender, any history of the patient, any allergies, any medications, any other relevant information.
`;
};

export const buildQuestionPrompt = (
  context: string,
  studyOfInterest: string[]
) => {
  return `Based on the following clinical trial protocol context and the patient's areas of interest, generate a comprehensive screening questionnaire.

IMPORTANT: Use the ACTUAL inclusion and exclusion criteria from the protocol documents provided below. Do not generate generic questions - base your questions directly on the specific criteria mentioned in the protocol context.

Study Areas of Interest: ${studyOfInterest.join(", ")}

Protocol Context (Inclusion/Exclusion Criteria):
${context}

Generate a detailed questionnaire with the following structure and sections:

IMPORTANT: Format the output exactly like this example structure, using \\n for line breaks:

Screening Questionnaire for Clinical Trial [Protocol Name] ([Study Area])\\n\\nDemographic Information:\\n1. Full Name:\\n2. Age:\\n3. Sex:\\n4. Contact Information (Phone Number, Email):\\n5. Height and Weight:\\n\\nConsent:\\n6. Have you provided written informed consent for participation in this study?\\n\\nMedical History:\\n[Include questions based on specific inclusion/exclusion criteria from the protocol]\\n\\nCurrent Medications and Allergies:\\n[Include medication and allergy questions based on protocol criteria]\\n\\nLifestyle Factors:\\n[Include lifestyle questions mentioned in protocol criteria]\\n\\nAvailability and Commitment to the Study:\\n[Include commitment and availability questions]\\n\\nOther:\\n[Include any other specific requirements from the protocol]

IMPORTANT: 
- Replace ALL line breaks with \\n
- Structure the questionnaire with clear section headers
- Number questions sequentially across all sections
- Base questions directly on the actual protocol criteria provided
- Return only the formatted string, not wrapped in JSON
- Ensure the text is JSON-safe for storage in MongoDB`;
};

export const manualScreeningPrompt = (context: string) => {
  return `You are a clinical trial screening assistant. Your task is to screen a patient strictly against all inclusion and exclusion criteria from the trial protocol.

Instructions:

Start by asking the most fundamental eligibility question (e.g., age, gender, or any critical criterion that could immediately rule someone out).

If the patient is not eligible based on this answer, inform them immediately and stop further questioning.

If the patient is potentially eligible, confirm that and then continue asking the next screening question, one at a time, strictly following the protocol.

Only ask the next question after receiving the answer to the previous one.

Do not explain all rules or criteria at once.

Protocol Information:
${context}`;
};
