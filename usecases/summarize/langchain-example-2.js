import ora from 'ora'
import path from 'path'
import url from 'url'
import { retrieveTranscription } from '../../utils/index.js'
import { ChatOllama } from '@langchain/ollama'
import { ChatOpenAI } from '@langchain/openai'
import { meetingSummaryTemplate } from '../../templates/meetings.js'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const transcriptionFileName = process.argv[2]
const pathToTranscription = path.join(__dirname, '../..', transcriptionFileName)
const cleanedTranscription = await retrieveTranscription(pathToTranscription)

// const chatModel = new ChatOllama({
//   model: 'llama3.2',
//   temperature: 0.5,
//   verbose: true
// })

const chatModel = new ChatOpenAI({
  temperature: 0.5
  // verbose: true
})

const spinner = ora({
  text: 'Generating summary...',
  spinner: 'binary'
}).start()

const summary = await meetingSummaryTemplate.pipe(chatModel).invoke({
  meetingType: 'technical',
  transcript: cleanedTranscription
})

spinner.stop()

console.log(summary.usage_metadata)
console.log(summary.response_metadata)
console.log('-'.repeat(50))
console.log(summary.content)
