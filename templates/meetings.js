import { ChatPromptTemplate } from '@langchain/core/prompts'

export const meetingSummaryTemplate = ChatPromptTemplate.fromMessages([
  ['system', 'You are an expert in summarizing meetings.'],
  [
    'user',
    'The following is a transcript of {meetingType} meeting among a group of people in a team. Summarize the meeting in clear, concise and accurate manner, using bullet points divided into sections such as key points, action items, decisions, and questions.\n\nTranscript:\n{transcript}'
  ]
])
