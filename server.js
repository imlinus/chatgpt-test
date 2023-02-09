import express from 'express'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

const app = express()

app.use(cors())
app.use(express.json())

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

app.get('/', async (request, response) => {
  response.status(200).send({
    message: 'Hello, world.'
  })
})

app.post('/chatgpt', async (request, response) => {
  try {
    const prompt = request.body.prompt || ''

    if (prompt.trim().length === 0) {
      response.status(400).json({
        error: {
          message: 'Please enter valid prompt'
        }
      })
   
      return
    }

    const ai = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    })

    response.status(200).send(ai.data.choices[0].text)
  } catch (error) {
    console.error(error)
    response.status(500).send(error || 'something went wrong')
  }
})

app.listen(6000, () =>
  console.log('server started on http://localhost:6000')
)
