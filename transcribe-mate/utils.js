import readline from 'node:readline/promises'

/**
 * Prompts the user with a question in the terminal and returns the user's answer.
 * @param {string} question - The question to prompt the user with.
 * @returns {Promise<string>} A promise that resolves to the user's answer.
 */
export const promptTerminal = async (question) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  const answer = await rl.question(question)
  rl.close()
  return answer
}

/**
 * Returns the local date and time in the format YYYYMMDD-HHMM.
 * @returns {string} A string in the format YYYYMMDD-HHMM.
 */
export const getDateTimeString = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  const hour = now.getHours().toString().padStart(2, '0')
  const minute = now.getMinutes().toString().padStart(2, '0')

  return `${year}${month}${day}-${hour}${minute}`
}
