import fs from 'fs/promises'
import { encode } from 'gpt-3-encoder'
import OpenAI from 'openai'
import path from 'path'
import url from 'url'
import { promptTerminal, removeDuplicateAdjacentWords } from '../utils/index.js'

const openai = new OpenAI()
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

/**
 * Main function to process the transcription file and generate a summary.
 */
const main = async () => {
  const transcriptionFileName = process.argv[2]
  if (!transcriptionFileName || !transcriptionFileName.endsWith('.txt')) {
    throw new Error('Please provide a valid transcription file name')
  }
  const tFilePath = path.join(__dirname, '..', transcriptionFileName)
  const transcription = await fs.readFile(tFilePath, 'utf-8')
  const cleanedTranscription = removeDuplicateAdjacentWords(transcription)

  const prompt = `The following is a transcript of technical meeting among a group of people in a team. Summarize the meeting in clear, concise and accurate manner, using bullet points divided into sections such as key points, action items, decisions, and questions. \n\nTranscript:\n${cleanedTranscription}`

  const encoded = encode(prompt)

  // console.log('Encoded this string looks like: ', encoded)
  console.log('Approximate number of prompt tokens:', encoded.length)

  const answer = await promptTerminal('Do you want to continue? (y/n)\n')
  if (answer !== 'y') {
    console.log('Exiting...')
    process.exit(0)
  }

  const model = process.env.OPENAI_MODEL_NAME ?? 'gpt-4o-mini'

  const response = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content: [
          {
            type: 'text',
            text: 'you are my helpful assistant'
          }
        ]
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt
          }
        ]
      }
    ],
    stream: false,
    temperature: 0.5,
    max_tokens: 10_000,
    top_p: 0.9, // chat gpt recommends keeping it low to make the output deterministic
    frequency_penalty: 0.8,
    presence_penalty: 0.5
  })

  console.log('\n\n')
  console.log(response.choices[0].message.content)
  console.log('-'.repeat(80))
  console.log('Stats:\n', response.usage)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
