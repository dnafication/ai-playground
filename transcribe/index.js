import { spawn } from 'child_process'
import filenamify from 'filenamify'
import fs from 'node:fs'
import { getDateTimeString, promptTerminal } from '../utils/index.js'
import path from 'path'

const { RECORD_EXECUTABLE, PATH_TO_TRANSCRIBE_MODEL, PATH_TO_TRANSCRIBE_EXEC } =
  process.env

/**
 * RECord and Transcribe
 * Record and transcribe a meeting. This script calls external programs to
 * record audio and transcribe it.
 */

const meetingName = await promptTerminal('Enter meeting name\n')
if (!meetingName) {
  throw new Error('Meeting name is required')
}

const dateTimeString = getDateTimeString()

const fileName = filenamify(`${dateTimeString}-${meetingName}.wav`, {
  replacement: '-'
}).replace(/ /g, '-')
const filePath = './recordings/' + fileName

// Ensure the recordings directory exists
if (!fs.existsSync('./recordings')) {
  fs.mkdirSync('./recordings', { recursive: true })
}

console.log('Saving transcription to: ', filePath)

const recordProcess = spawn(RECORD_EXECUTABLE, [
  '-r',
  '16000',
  '-b',
  '16',
  filePath
])
recordProcess.stdout.pipe(process.stdout)
recordProcess.stderr.pipe(process.stderr)

recordProcess.on('error', (err) => {
  console.error('Failed to start recording process:', err)
  process.exitCode = 1
})

process.on('SIGINT', async () => {
  console.log('Stopping recording...')
  recordProcess.kill()
  console.log('Transcribing...')
  const transcribeProcess = spawn(PATH_TO_TRANSCRIBE_EXEC + '/main', [
    '-m',
    path.join(PATH_TO_TRANSCRIBE_MODEL, 'ggml-base.en.bin'),
    '-f',
    filePath,
    '-otxt'
  ])

  transcribeProcess.on('error', (err) => {
    console.error('Failed to start transcription process:', err)
    process.exitCode = 1
  })

  transcribeProcess.stdout.pipe(process.stdout)
  transcribeProcess.stderr.pipe(process.stderr)

  await new Promise((resolve) => transcribeProcess.on('exit', resolve))
  console.log('Transcription complete.')
  process.exit(0)
})
