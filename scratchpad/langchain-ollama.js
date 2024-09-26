import { HumanMessage } from '@langchain/core/messages'
import { ChatOllama } from '@langchain/ollama'
const model = new ChatOllama({
  model: 'llama3.1',
  verbose: true
})

await model.invoke([new HumanMessage('write a fizzbuzz program in go')])

// const result = await model.invoke(['human', 'Hello, how are you?'])
// console.log(result)
