import { encode } from 'gpt-3-encoder'
import OpenAI from 'openai'
import ora from 'ora'
import path from 'path'
import url from 'url'
import { promptTerminal, retrieveTranscription } from '../../utils/index.js'

const openai = new OpenAI()
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

/**
 * Main function to process the transcription file and generate a summary.
 */
const main = async () => {
  const transcriptionFileName = process.argv[2]
  const pathToTranscription = path.join(
    __dirname,
    '../..',
    transcriptionFileName
  )
  const cleanedTranscription = await retrieveTranscription(pathToTranscription)

  const prompt = `The following is a transcript of technical meeting among a group of people in a team. Summarize the meeting in clear, concise and accurate manner, using bullet points divided into sections such as key points, action items, decisions, and questions. \n\nTranscript:\n${cleanedTranscription}`

  const encoded = encode(prompt)

  // console.log('Encoded this string looks like: ', encoded)
  console.log('Approximate number of prompt tokens:', encoded.length)

  const answer = await promptTerminal('Do you want to continue? (y/n)\n')
  if (answer !== 'y') {
    console.log('Exiting...')
    process.exit(0)
  }
  const messages = [
    {
      role: 'system',
      content: [
        {
          type: 'text',
          text: 'You are an expert in summarizing meetings.'
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
  ]

  const model = process.env.OPENAI_MODEL_NAME ?? 'gpt-4o-mini'

  const spinner = ora({
    text: 'Generating summary...',
    spinner: 'binary'
  }).start()

  const response = await openai.chat.completions.create({
    model,
    messages,
    stream: false,
    temperature: 0.5,
    max_tokens: 10_000,
    top_p: 0.9, // chat gpt recommends keeping it low to make the output deterministic
    frequency_penalty: 0.8,
    presence_penalty: 0.5
  })

  spinner.stop()

  console.log('\n\n')
  console.log(response.choices[0].message.content)
  console.log('-'.repeat(80))
  console.log('Stats:\n', response.usage)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
