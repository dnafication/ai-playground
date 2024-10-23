import path from 'path'
import url from 'url'
import { retrieveTranscription } from '../../utils/index.js'
import { loadSummarizationChain } from 'langchain/chains'
// import { SearchApiLoader } from '@langchain/community/document_loaders/web/searchapi'
import { TokenTextSplitter } from '@langchain/textsplitters'
import { PromptTemplate } from '@langchain/core/prompts'
// import { ChatAnthropic } from '@langchain/anthropic'
import { ChatOpenAI } from '@langchain/openai'
import { ChatOllama } from '@langchain/ollama'
import { Document } from '@langchain/core/documents'

// const loader = new SearchApiLoader({
//   engine: 'youtube_transcripts',
//   video_id: 'WTOm65IZneg'
// })

// const docs = await loader.load()

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const transcriptionFileName = process.argv[2]
const pathToTranscription = path.join(__dirname, '../..', transcriptionFileName)
const cleanedTranscription = await retrieveTranscription(pathToTranscription)

const transcriptDoc = new Document({
  pageContent: cleanedTranscription
})

const splitter = new TokenTextSplitter({
  chunkSize: 10000,
  chunkOverlap: 250
})

const docsSummary = await splitter.splitDocuments([transcriptDoc])

const llmSummary = new ChatOllama({
  model: 'llama3.2',
  temperature: 0.5,
  topP: 0.9,
  frequencyPenalty: 0.8,
  presencePenalty: 0.5,
  streaming: false
})

const summaryTemplate = `
The following is a transcript of technical meeting among a group of people in a team. Summarize the meeting in clear, concise and accurate manner, using bullet points divided into sections such as key points, action items, decisions, and questions.

Transcript:
--------
{text}
--------

`

const SUMMARY_PROMPT = PromptTemplate.fromTemplate(summaryTemplate)

const summaryRefineTemplate = `
You are an expert in summarizing meetings.
Your goal is to create a summary of a meeting.
We have provided an existing summary up to a certain point: {existing_answer}

Below you find the transcript of the meeting:
--------
{text}
--------

Given the new context, refine the summary and example questions.
The transcript of the meeting will also be used as the basis for a question and answer bot.
Provide some examples questions and answers that could be asked about the meeting. Make these questions very specific.
If the context isn't useful, return the original summary and questions.
Total output will be a summary of the meeting and a list of example questions the user could ask of the meeting.

SUMMARY AND QUESTIONS:
`

const SUMMARY_REFINE_PROMPT = PromptTemplate.fromTemplate(summaryRefineTemplate)

const summarizeChain = loadSummarizationChain(llmSummary, {
  type: 'refine',
  verbose: true,
  questionPrompt: SUMMARY_PROMPT,
  refinePrompt: SUMMARY_REFINE_PROMPT
})

const summary = await summarizeChain.run(docsSummary)

console.log(summary)
