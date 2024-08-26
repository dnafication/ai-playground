# ai-playground

My scratchpad for AI/ML experiments and tools

## Start

- Install `nvm`

```bash
# Set up the right node version
nvm use

# Install dependencies
npm install

# Run the scratchpad
npm run scratch <path-to-scratchpad>

# Example
npm run scratch scratchpad/openai-basics.js

```

## Transcribe & Summarize

- Install SoX (Sound eXchange, the Swiss Army knife of audio manipulation). The scripts use `rec` to record audio.
- Depends directly on [whisper.cpp](https://github.com/ggerganov/whisper.cpp) which is a Port of OpenAI's Whisper model in C/C++. You must provide path to the main executable and the models in `.env` file.
- Any OpenAI compatible API server can be used with the summarisation script. Just update the `.env` file with the appropriate API endpoint and key. If you are running tools like LM Studio, just point to the local server in `OPENAI_BASE_URL` and the model name in `OPENAI_MODEL_NAME`.

```bash
# run the following and follow the prompts
npm run transcribe

# summarize the transcription
npm run summarize recordings/transcription.txt
```

## Aside

Do NOT commit `.env` file. It is added to `.gitignore` but just in case. Use [git-secrets](https://github.com/awslabs/git-secrets) to prevent you from committing secrets and credentials into git repositories
