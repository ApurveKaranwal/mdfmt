import { pipeline, env } from '@huggingface/transformers';

// Skip local model checks since we are running in the browser
env.allowLocalModels = false;
env.backends.onnx.wasm.numThreads = 1; // Limit threads to prevent memory crash

class PipelineSingleton {
  static instance: any = null;

  static async getInstance(progressCallback: (msg: any) => void) {
    if (this.instance === null) {
      this.instance = await pipeline('text-generation', 'Xenova/distilgpt2', {
        progress_callback: progressCallback
      });
    }
    return this.instance;
  }
}

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
  const { text } = event.data;

  try {
    // We use a progress callback so the UI knows it's downloading
    const generator = await PipelineSingleton.getInstance((x) => {
      self.postMessage({ status: 'progress', progress: x });
    });

    const prompt = `Documentation details:\n${text}\n\nTechnical Expansion:\n`;

    const output = await generator(prompt, {
      max_new_tokens: 100,
      temperature: 0.7,
      repetition_penalty: 1.2,
      do_sample: true
    });

    self.postMessage({
      status: 'complete',
      result: output[0].generated_text.replace(prompt, '').trim()
    });
  } catch (error) {
    self.postMessage({ status: 'error', error: String(error) });
  }
});
