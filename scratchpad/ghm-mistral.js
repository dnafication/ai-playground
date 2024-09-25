import { Mistral } from '@mistralai/mistralai'

// To authenticate with the model you will need to generate a personal access token (PAT) in your GitHub settings.
// Create your PAT token by following instructions here: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
const token = process.env['GITHUB_TOKEN']

export async function main() {
  const client = new Mistral({
    apiKey: token,
    serverURL: 'https://models.inference.ai.azure.com'
  })

  const response = await client.chat.complete({
    model: 'Mistral-large',
    messages: [
      { role: 'system', content: '' },
      { role: 'user', content: 'What is the capital of France?' }
    ],
    temperature: 0.7,
    max_tokens: 4096,
    top_p: 1
  })

  console.log(response.choices[0].message.content)
}

main().catch((err) => {
  console.error('The sample encountered an error:', err)
})
