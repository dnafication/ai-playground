/*
Using Azure REST API to interact with the Llama model
> npm install @azure-rest/ai-inference @azure/core-auth @azure/core-sse
*/
import ModelClient from '@azure-rest/ai-inference'
import { AzureKeyCredential } from '@azure/core-auth'
import fs from 'node:fs'
import path from 'node:path'
import mime from 'mime-types'

// To authenticate with the model you will need to generate a personal access token (PAT) in your GitHub settings.
// Create your PAT token by following instructions here: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
const token = process.env['GITHUB_TOKEN']

const __dirname = import.meta.dirname

export async function main() {
  const client = new ModelClient(
    'https://models.inference.ai.azure.com',
    new AzureKeyCredential(token)
  )
  const imageFilePath = path.join(__dirname, 'lighthouse.jpeg')

  // let response = await client.path('/info').get({
  //   headers: {
  //     'x-ms-model-mesh-model-name': 'Llama-3.2-11B-Vision-Instruct'
  //   }
  // })

  const image = fs.readFileSync(imageFilePath).toString('base64')

  const mimeType = mime.lookup(imageFilePath)
  console.log(mimeType)

  const response = await client.path('/chat/completions').post({
    body: {
      messages: [
        { role: 'system', content: '' },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'What’s in this image?'
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${image}`
              }
            }
          ]
        }
      ],
      model: 'Llama-3.2-11B-Vision-Instruct',
      temperature: 0.4,
      max_tokens: 4096,
      top_p: 0.1
    }
  })

  if (response.status !== '200') {
    throw response.body.error
  }
  console.log(response.body.choices)
  // console.log(response.body)
}

main().catch((err) => {
  console.error('The sample encountered an error:', err)
})
