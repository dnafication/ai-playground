import OpenAI from 'openai'

const openai = new OpenAI()

async function main(stream) {
  if (stream) {
    const chunks = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Say this is a test with stream' }],
      stream
    })
    for await (const chunk of chunks) {
      process.stdout.write(chunk.choices[0]?.delta?.content || '')
    }
  } else {
    const resp = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Say hello world is ' + stream }],
      stream
    })
    console.log(resp.choices)
  }
}

main(false)
