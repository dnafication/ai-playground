import fs from 'node:fs'
import axios from 'axios'
import FormData from 'form-data'
import path from 'node:path'

const __dirname = import.meta.dirname

const payload = {
  prompt: 'Lighthouse on a cliff overlooking the ocean',
  output_format: 'jpeg'
}

const response = await axios.postForm(
  `https://api.stability.ai/v2beta/stable-image/generate/sd3`,
  axios.toFormData(payload, new FormData()),
  {
    validateStatus: undefined,
    responseType: 'arraybuffer',
    headers: {
      Authorization: `Bearer ${process.env.STABILITY_TOKEN}`,
      Accept: 'image/*'
    }
  }
)

if (response.status === 200) {
  fs.writeFileSync(
    path.join(__dirname, 'lighthouse.jpeg'),
    Buffer.from(response.data)
  )
} else {
  throw new Error(`${response.status}: ${response.data.toString()}`)
}
