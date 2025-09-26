import openai from "../config/openai";
import UploadedProtocolDetails from "../models/uploaded-protocol-details.schema";
import ProtocolDocument from "../models/protocol-document.schema";
import PatientQuestions from "../models/patient-questions.schema";
import { generateQuestionnairePrompt } from "../constants/prompts";
import { buildQuestionPrompt } from "../constants/prompts";

export interface InterestFormData {
  firstName: string;
  middleName?: string;
  lastName: string;
  phoneNo1: string;
  phoneNo2?: string;
  email?: string;
  dateOfBirth?: string;
  studyOfInterest: string[];
  submittedBy: string;
  bestTimeToCall?: string[];
  mailingAddress?: string;
  streetAddress?: string;
  apartmentNumber?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  specialInstruction?: string;
  acceptTerms: boolean;
}

export class InterestFormService {
  async processInterestForm(formData: InterestFormData) {
    try {
      const relevantProtocols = await this.findRelevantProtocols(
        formData.studyOfInterest
      );

      // console.log("relevantProtocols", relevantProtocols);

      // const protocolContext = await this.getProtocolContext(
      //   relevantProtocols,
      //   formData.studyOfInterest
      // );

      // if (
      //   !protocolContext ||
      //   protocolContext.includes("No specific protocol context available")
      // ) {
      //   const availableStudies = await this.getAvailableStudies();

      //   return {
      //     success: false,
      //     data: {
      //       ...formData,
      //       questions: null,
      //       availableStudies: availableStudies,
      //       message:
      //         "No specific studies found for your areas of interest. Would you like to answer questions about other available studies?",
      //       requiresUserChoice: true,
      //     },
      //     message:
      //       "No specific studies found for your areas of interest. Please choose from available studies.",
      //   };
      // }

      // const questions = await this.generateQuestions(
      //   protocolContext,
      //   formData.studyOfInterest
      // );

      let questions = "";

      switch (formData.studyOfInterest[0]) {
        case "dermatology":
          questions = `Screening Questionnaire for Clinical Trial dr-williams (Dermatology)\\n\\nDemographic Information:\\n1. Full Name:\\n2. Date of Birth:\\n3. Sex:\\n4. Contact Information (Phone Number, Email):\\n5. Location (City, State):\\n6. Height and Weight:\\n\\nConsent:\\n7. Have you provided written informed consent for participation in this study?\\n\\nMedical History:\\n8. Have you been diagnosed with Prurigo Nodularis?\\n9. If yes, how long has it been since your diagnosis?\\n10. Do you have any other skin or systemic morbidities? If yes, please specify.\\n11. Have you been treated for any medical condition in the last three months?\\n12. Have you been diagnosed with or treated for any neurological or psychiatric condition?\\n13. Have you ever been diagnosed with cancer or a blood disorder? If yes, when?\\n14. Have you ever had a major immunologic reaction?\\n\\nCurrent Medications and Allergies:\\n15. Are you currently on any medication? If yes, please specify the name, dosage, route, and frequency.\\n16. Have you taken any medication or undergone phototherapy for Prurigo Nodularis in the past year? If yes, please specify.\\n17. Are you allergic to any medication or substance?\\n\\nSocial and Family History:\\n18. Do you consume alcohol or use recreational drugs? If yes, please specify.\\n19. Do you smoke tobacco?\\n20. Is there a family history of chronic or hereditary conditions? If yes, please specify.\\n\\nStudy-Specific Eligibility:\\n21. Do you have more than 20 nodules on your legs, arms or trunk?\\n22. Have you experienced itching for more than 6 weeks?\\n23. Have you noticed evidence of chronic scratching?\\n24. Did you fail to respond to medium or high potency topical corticosteroids?\\n25. Have you completed at least 4 days of daily eDiary entries within the last 7 days?\\n\\nAvailability and Commitment:\\n26. Are you available for a 52-week treatment period and a subsequent 16-week follow-up?\\n27. Are you willing to complete daily questionnaires on an eDiary device throughout the study?\\n\\nOther:\\n28. To be confirmed on site: Fitzpatrick Classification System Skin Type`;
          break;
        case "cardiology":
          questions =
            `Screening Questionnaire for Clinical Trial dr-johnson (cardiology)\\n\\nDemographic Information:\\n1. Full Name:\\n2. Date of Birth:\\n3. Sex:\\n4. Contact Information (Phone Number, Email):\\n5. Location (City, State):\\n6. Height and Weight:\\n\\nConsent:\\n7. Do you provide your consent to participate in this study?\\n\\nMedical History:\\n8. Do you have a clinical diagnosis of Type 2 Diabetes (T2D)?\\n9. Do you have a history of Coronary heart disease, Peripheral arterial disease, Cerebrovascular disease, Chronic Kidney Disease (CKD), or Congestive heart failure (CHF)?\\n10. Do you have a history of any hematological condition that may interfere with HbA1c measurement, such as hemolytic anemias or sickle cell disease?\\n11. Do you have a history of an active or untreated malignancy or are in remission from a clinically significant malignancy for less than 5 years?\\n12. Do you have a family (first-degree relative) or personal history of medullary thyroid carcinoma or multiple endocrine neoplasia syndrome type 2?\\n\\nCurrent Medications and Allergies:\\n13. Are you on treatment with at least 1 and no more than 3 oral antihyperglycemic drugs for at least 90 days?\\n14. Do you take any medication for diabetes (metformin, SGLT-2 inhibitors, or sulfonylureas)?\\n15. Have you used any weight loss drugs or alternative remedies, including herbal or nutritional supplements, within 90 days prior to screening?\\n\\nSocial and Family History:\\n16. Are you a smoker, or do you consume alcohol? If so, how frequently?\\n17. Is there a family history of heart disease or diabetes?\\n\\nStudy-Specific Eligibility:\\n18. Is your HbA1c value at screening between ≥7.0% (53 mmol/mol) and ≤10.5% (91 mmol/mol) if background diabetes medication does not include a sulfonylurea, or between ≥7.5% (58 mmol/mol) and ≤10.5% (91 mmol/mol) if background diabetes medication includes a sulfonylurea?\\n19. Are you willing to maintain a study diary, and complete patient questionnaires?\\n20. Have you had any cardiovascular conditions within 60 days prior to screening, or are currently planning or undergoing any procedures between Visit 1 and Visit 3 such as coronary revascularization, carotid revascularization, or peripheral artery revascularization?\\n21. Have you had chronic or acute pancreatitis any time prior to screening?\\n\\nAvailability and Commitment:\\n22. Are you available for the duration of the study and able to follow study procedures as required?\\n23. Do you agree to not initiate an intensive diet or exercise program during the study with the intent of reducing body weight other than the lifestyle and dietary measures for diabetes treatment?\\n\\nOther:\\n24. Do you have an eGFR <15 mL/min/1.73 m2 as determined at Visit 1 (calculated by CKD-EPI cystatin-c equation) if not on metformin at Visit 1; for participants on metformin at Visit 1, the eGFR determined at Visit 1 (calculated by CKD-EPI cystatin-c equation) must not be <30 mL/min/1.73 m2?\\n25. The eligibility of some criteria will be confirmed on site.`;
          break;
        case "pulmonology":
          questions =
            `Screening Questionnaire for Clinical Trial dr-davis (Pulmonology)\\n\\nDemographic Information:\\n1. Full Name:\\n2. Date of Birth:\\n3. Sex:\\n4. Contact Information (Phone Number, Email):\\n5. Location (City, State):\\n6. Height and Weight:\\n\\nConsent:\\n7. Have you provided written informed consent for participation in this study?\\n\\nMedical History:\\n8. Have you been diagnosed with Chronic Obstructive Pulmonary Disease (COPD)?\\n9. Are you a current or former smoker with a history of at least 10 pack-years of cigarette smoking?\\n10. Do you have any established cardiovascular disease?\\n11. Have you had pneumonia or a severe COPD exacerbation that has not resolved at least 8 weeks ago?\\n12. Do you have any life-threatening condition, including malignancy, with a life expectancy less than 5 years, other than CV disease or COPD?\\n\\nCurrent Medications and Allergies:\\n13. Are you currently using any medication? If yes, please list them with their dosage, route, and frequency.\\n14. Have you used any maintenance Inhaled Corticosteroids (ICS) treatment within the past 12 months?\\n15. Are you allergic to any medication? If yes, please list them.\\n\\nSocial and Family History:\\n16. Are you a current smoker or have you smoked in the past? If yes, how many cigarettes per day and for how many years?\\n17. Do you consume alcohol or caffeine? If yes, how frequently?\\n\\nStudy-Specific Eligibility:\\n18. Is your Forced Vital Capacity (FVC) ratio less than 70%?\\n19. Is your baseline peripheral blood eosinophil count greater than or equal to 100 cells/mm3?\\n20. Is your CAT (COPD Assessment Test) score greater than or equal to 10?\\n21. Have you participated in another clinical study with a study intervention administered in the last 30 days or 5 half-lives, whichever is longer prior to Visit 1?\\n22. Are you pregnant or breastfeeding?\\n\\nAvailability and Commitment:\\n23. Are you able to commit to the duration of the study?\\n24. Are you available for all scheduled visits?\\n\\nOther:\\n25. Are you comfortable at rest; does ordinary physical activity result in fatigue, palpitations, breathlessness, or angina pectoris?\\n26. To be confirmed on site: Spirometry Testing, Physical Examinations, Height and Weight measurements.`;
          break;
        default:
          break;
      }

      const patientQuestions = new PatientQuestions({
        ...formData,
        questions,
        protocol_id: relevantProtocols[0]?.protocol_id,
        protocol_name: relevantProtocols[0]?.pi,
        indication: relevantProtocols[0]?.indication,
      });

      const savedPatientQuestions = await patientQuestions.save();

      return {
        success: true,
        data: savedPatientQuestions,
        message: "Interest form processed successfully and questions generated",
      };
    } catch (error) {
      console.error("Error processing interest form:", error);
      throw new Error("Failed to process interest form");
    }
  }

  private async findRelevantProtocols(studyOfInterest: string[]) {
    try {
      const exactMatches = await UploadedProtocolDetails.find({
        indication: { $in: studyOfInterest },
      }).limit(10);

      if (exactMatches.length > 0) {
        return exactMatches;
      }

      const regexPatterns = studyOfInterest.map(
        (study) => new RegExp(study.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
      );

      const similarMatches = await UploadedProtocolDetails.find({
        $or: [
          { indication: { $regex: regexPatterns[0] } },
          { pi: { $regex: regexPatterns[0] } },
        ],
      }).limit(3);

      if (similarMatches.length > 0) {
        return similarMatches;
      }

      const anyProtocols = await UploadedProtocolDetails.find({})
        .limit(3)
        .sort({ createdAt: -1 });

      return anyProtocols;
    } catch (error) {
      console.error("Error finding relevant protocols:", error);
      return [];
    }
  }

  private async getProtocolContext(
    protocols: any[],
    studyOfInterest: string[]
  ) {
    try {
      let context = "";

      for (const protocol of protocols) {
        const searchQuery = `inclusion criteria exclusion criteria eligibility requirements screening criteria ${studyOfInterest.join(
          " "
        )}`;
        const inclusionExclusionEmbedding = await this.getEmbedding(
          searchQuery
        );

        const relevantChunks = await ProtocolDocument.aggregate([
          {
            $vectorSearch: {
              index: "vector_index",
              path: "embedding",
              queryVector: inclusionExclusionEmbedding,
              numCandidates: 100,
              limit: 15, // Reduced to 15 to manage context length
            },
          },
          {
            $match: {
              protocol_id: protocol.protocol_id,
            },
          },
          {
            $project: {
              _id: 0,
              text: 1,
              page: 1,
              chunk: 1,
              score: { $meta: "vectorSearchScore" },
            },
          },
          {
            $sort: { score: -1 },
          },
        ]);

        if (relevantChunks.length > 0) {
          context += `\n\nProtocol: ${protocol.pi} (${protocol.indication})\n`;
          context += `Protocol ID: ${protocol.protocol_id}\n`;
          context += `Enrollment Start Date: ${protocol.enrollment_startDate}\n`;
          context += `Study Areas of Interest: ${studyOfInterest.join(", ")}\n`;
          context += "Relevant Inclusion/Exclusion Criteria:\n";

          // Truncate content to prevent context length issues
          const truncatedChunks =
            this.truncateContentForContext(relevantChunks);

          truncatedChunks.forEach((chunk, index) => {
            context += `\n--- Document ${index + 1} (Page ${
              chunk.page
            }, Chunk ${chunk.chunk}, Relevance Score: ${chunk.score.toFixed(
              3
            )}) ---\n`;
            context += chunk.text;
          });
        }
      }

      return (
        context ||
        "No specific protocol context available. Generate general clinical trial screening questions."
      );
    } catch (error) {
      console.error("Error getting protocol context:", error);
      return "No specific protocol context available. Generate general clinical trial screening questions.";
    }
  }

  private async generateQuestions(context: string, studyOfInterest: string[]) {
    try {
      const prompt = buildQuestionPrompt(context, studyOfInterest);

      // Check if prompt is too long and truncate if necessary
      const maxPromptLength = 50000; // Conservative limit
      const finalPrompt =
        prompt.length > maxPromptLength
          ? prompt.substring(0, maxPromptLength) +
            "\n\n[Content truncated due to length]"
          : prompt;

      const completion = await openai.chat.completions.create({
        model: "gpt-4", // Use GPT-4 for better context handling
        messages: [
          {
            role: "system",
            content:
              "You are an expert clinical trial coordinator. Generate a comprehensive screening questionnaire for potential study participants based on the provided protocol context and study interests.",
          },
          {
            role: "user",
            content: finalPrompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      });

      return (
        completion.choices[0]?.message?.content || "No questions generated"
      );
    } catch (error) {
      console.error("Error generating questions with OpenAI:", error);

      // If it's a context length error, try with a shorter context
      if (
        error instanceof Error &&
        error.message &&
        error.message.includes("context length")
      ) {
        console.log("Context too long, trying with truncated context...");
        const truncatedContext =
          context.substring(0, 20000) + "\n\n[Context truncated due to length]";
        const truncatedPrompt = buildQuestionPrompt(
          truncatedContext,
          studyOfInterest
        );

        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content:
                  "You are an expert clinical trial coordinator. Generate a comprehensive screening questionnaire for potential study participants based on the provided protocol context and study interests.",
              },
              {
                role: "user",
                content: truncatedPrompt,
              },
            ],
            max_tokens: 2000,
            temperature: 0.7,
          });

          return (
            completion.choices[0]?.message?.content || "No questions generated"
          );
        } catch (retryError) {
          console.error("Error with truncated context:", retryError);
        }
      }

      return this.generateFallbackQuestions(studyOfInterest);
    }
  }

  private truncateContentForContext(chunks: any[]): any[] {
    const maxTokens = 12000; // Leave room for prompt and response
    const avgCharsPerToken = 4; // Rough estimate
    const maxChars = maxTokens * avgCharsPerToken;

    let totalChars = 0;
    const truncatedChunks = [];

    for (const chunk of chunks) {
      const chunkChars = chunk.text.length;

      if (totalChars + chunkChars > maxChars) {
        const remainingChars = maxChars - totalChars;
        if (remainingChars > 200) {
          const truncatedText =
            chunk.text.substring(0, remainingChars - 50) + "...";
          truncatedChunks.push({
            ...chunk,
            text: truncatedText,
          });
        }
        break;
      }

      truncatedChunks.push(chunk);
      totalChars += chunkChars;
    }

    return truncatedChunks;
  }

  private async getEmbedding(text: string): Promise<number[]> {
    try {
      const resp = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
      });
      return resp.data[0].embedding;
    } catch (error) {
      console.error("Error generating embedding:", error);
      throw new Error("Failed to generate embedding");
    }
  }

  private async getAvailableStudies() {
    try {
      const studies = await UploadedProtocolDetails.find({})
        .select("protocol_id pi indication enrollment_startDate")
        .limit(10)
        .sort({ createdAt: -1 });

      return studies.map((study) => ({
        protocol_id: study.protocol_id,
        protocol_name: study.pi,
        indication: study.indication,
        enrollment_start_date: study.enrollment_startDate,
      }));
    } catch (error) {
      console.error("Error getting available studies:", error);
      return [];
    }
  }

  async processQuestionsForStudy(
    formData: InterestFormData,
    selectedProtocolId: string
  ) {
    try {
      // Find the selected protocol
      const selectedProtocol = await UploadedProtocolDetails.findOne({
        protocol_id: selectedProtocolId,
      });

      if (!selectedProtocol) {
        throw new Error("Selected study not found");
      }

      const protocolContext = await this.getProtocolContext(
        [selectedProtocol],
        formData.studyOfInterest
      );

      const questions = await this.generateQuestions(protocolContext, [
        selectedProtocol.indication,
      ]);

      const patientQuestions = new PatientQuestions({
        ...formData,
        questions,
        protocol_id: selectedProtocol.protocol_id,
        protocol_name: selectedProtocol.pi,
        indication: selectedProtocol.indication,
      });

      const savedPatientQuestions = await patientQuestions.save();

      return {
        success: true,
        data: savedPatientQuestions,
        message: "Questions generated successfully for the selected study",
      };
    } catch (error) {
      console.error("Error processing questions for selected study:", error);
      throw new Error("Failed to process questions for selected study");
    }
  }

  private generateFallbackQuestions(studyOfInterest: string[]) {
    return `Clinical Trial Screening Questionnaire

1. What is your age?
2. What is your gender?
3. Do you have any known allergies to medications?
4. Are you currently taking any medications? If yes, please list them.
5. Do you have any chronic medical conditions
6. Have you participated in any clinical trials in the past 6 months?
7. Are you pregnant or planning to become pregnant?
8. Do you have any mobility limitations?
9. Are you available for regular study visits?
10. Do you have any concerns about participating in a clinical trial?

Study-Specific Questions for: ${studyOfInterest.join(", ")}

11. Have you been diagnosed with any conditions related to ${studyOfInterest.join(
      " or "
    )}?
12. Are you currently receiving treatment for any of these conditions?
13. How long have you been experiencing symptoms related to these conditions?
14. Have you had any recent hospitalizations?
15. Do you have any family history of ${studyOfInterest.join(" or ")}?

Please provide detailed answers to help determine your eligibility for our clinical trials.`;
  }
}

export default new InterestFormService();
