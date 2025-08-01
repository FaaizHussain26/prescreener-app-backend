export const generateQuestionnairePrompt = (context: string) => {
    return `You are a system that parses clinical trial documents and generates structured screening questionnaires.
  
  # Protocol Input
  ${context}
  
  # Study Reference
  Study ID: RPL554-CO-212  
  Study Focus: Moderate-to-Severe COPD  
  Study Sites: Dr. Raza Site, Verona Site
  
  # Task
  Based on the provided clinical screening criteria, generate a participant screening questionnaire using the following rules:
  
  - Extract **exclusion** and **inclusion** criteria from the content. Use consistent medical phrasing.
  - Present **exclusion criteria first** to support early disqualification logic.
  - Add standard demographic questions at the beginning: Full Name, Date of Birth, Age, Gender, Contact Info, ZIP Code.
  - Organize the questions under the following clear headings:
    1. Demographics
    2. Exclusion Criteria
    3. Inclusion Criteria
  - Each question should be clearly numbered.
  - For each question, format as: "Q[number]. [Question text] (Yes/No)"
  - Ensure inclusion criteria questions require "Yes" to qualify; exclusion criteria require "No".
  - If a disqualifying response is given, end with:  
    "You do not meet the eligibility criteria due to: [question text]."
  - If all responses meet eligibility:  
    "You are eligible for: RPL554-CO-212 COPD Study."
  
  # Output
  Only return the final questionnaire in plain text.  
  Do not include any code, JSON, markdown, or explanations.`;
  };
  