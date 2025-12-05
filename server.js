import express from 'express';
import { spawn } from 'child_process';
import path from 'path';

const app = express();
app.use(express.json());

const modelPath = path.join(__dirname, 'models', 'ggml-gpt4all-j.bin');

app.post('/ai', async (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt) return res.status(400).send({ error: 'No prompt provided' });

  // Spuštění GPT4All CLI modelu
  const gpt = spawn('gpt4all', ['--model', modelPath, '--prompt', prompt]);

  let output = '';
  gpt.stdout.on('data', (data) => output += data.toString());
  gpt.stderr.on('data', (data) => console.error(data.toString()));

  gpt.on('close', () => res.json({ reply: output }));
});

app.listen(process.env.PORT || 3000, () => console.log('AI API running'));
