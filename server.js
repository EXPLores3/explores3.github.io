const url = 'https://api.siliconflow.cn/v1/chat/completions';
const options = {
  method: 'POST',
  headers: {Authorization: 'Bearer sk-egpaeaztksryiwbebciehvacervfrlhgctuuwpmmbmacrubb', 'Content-Type': 'application/json'},
  body: '{"model":"deepseek-ai/DeepSeek-R1-0528-Qwen3-8B","max_tokens":512,"enable_thinking":true,"thinking_budget":4096,"min_p":0.05,"temperature":0.7,"top_p":0.7,"top_k":50,"frequency_penalty":0.5,"n":1,"messages":[{"role":"user","content":"What opportunities and challenges will the Chinese large model industry face in 2025?"}]}'
};

try {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error(error);
}
