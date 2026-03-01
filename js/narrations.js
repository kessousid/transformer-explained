/* ================================================
   TRANSFORMER EXPLAINED — Slide Narrations
   Audio narration text for every slide in every lesson.
   Read aloud via the Web Speech API (TTSController in app.js).
   ================================================ */

window.NARRATIONS = {

  /* ── LESSON 01: Introduction ── */
  '01': [
    "Welcome to Transformer Explained! A Transformer is a type of neural network architecture specifically designed to understand and generate text. When you type a message to ChatGPT or Claude, a Transformer reads your message and writes the response. In this course you'll learn exactly how this remarkable technology works, step by step, with no prior machine learning knowledge required.",

    "All of today's most popular AI tools — ChatGPT, Claude, Gemini, Llama, and GitHub Copilot — are powered by Transformer models. These systems can write essays, answer complex questions, translate languages, summarise documents, and have natural conversations. What's remarkable is that they all share the same fundamental architecture that you're about to learn.",

    "Before 2017, AI researchers used Recurrent Neural Networks — known as RNNs — to process text. RNNs work like reading a book one word at a time, from left to right. The problem is that by the time the model reaches the end of a long sentence, it has largely forgotten the beginning. This is called the memory problem, and it severely limited what AI could do with language.",

    "Everything changed in June 2017 when a team of eight researchers at Google published a paper called Attention Is All You Need. This paper introduced the Transformer architecture — a completely new way to process sequences. Instead of reading left to right, the Transformer looks at all words simultaneously. This single idea unlocked the modern era of artificial intelligence.",

    "The key innovation in Transformers is called Attention. Attention allows every word in a sentence to directly look at every other word and decide which ones are most relevant. Consider the sentence: The animal did not cross the street because it was too tired. To understand what 'it' refers to, you need to consider both 'animal' and 'street' at the same time. The attention mechanism makes this possible.",

    "Here is your learning roadmap. We will start with tokenization and embeddings — how text becomes numbers the model can work with. Then we dive deep into the attention mechanism — the core innovation. Next, we explore the full encoder and decoder architecture. Finally, we see how all of this comes together in modern Large Language Models like GPT-4 and Claude. Let's begin!"
  ],

  /* ── LESSON 02: Tokenization ── */
  '02': [
    "Computers are fundamentally number-crunching machines. They cannot directly process words like 'Hello world' — everything must be converted to numbers first. Tokenization is the process of converting text into a sequence of numerical token IDs that a language model can work with. It is the very first step in every language model's processing pipeline.",

    "A token is a chunk of text — usually a word, part of a word, or a punctuation mark. Each unique token maps to a number called a token ID. Notice that the word 'Transformers' gets split into 'Transform' and 'ers' — two separate tokens. This splitting of words into sub-parts is called subword tokenization, and it is how modern language models handle the enormous variety of human language.",

    "Why split words into sub-parts instead of using whole words? Three main reasons. First, new words and slang appear constantly, and a fixed whole-word vocabulary cannot handle them. Second, a complete English vocabulary would need over 170,000 entries. Third, subword tokenization captures word structure — 'run', 'running', and 'runner' share the 'run' piece, helping the model understand their connection.",

    "Here are real tokenization examples from GPT-4. The phrase 'Hello world' becomes just two tokens. The word 'unbelievable' is split into three pieces: 'un', 'believ', and 'able'. Even 'ChatGPT' splits into 'Chat', 'G', and 'PT'. As a rule of thumb, one English token is roughly four characters of text. GPT-4 can handle up to 128,000 tokens in a single conversation.",

    "Every tokenizer has a fixed vocabulary — a complete list of all known tokens, each with a unique integer ID. GPT-2 uses about 50,000 tokens while GPT-4 uses over 100,000. Larger vocabularies mean fewer split words and more efficient text encoding. The tokenizer itself is trained separately before the main language model, using an algorithm called Byte-Pair Encoding that iteratively merges the most frequent character pairs.",

    "Now it is your turn to experiment. The interactive demo below lets you type any text and watch it split into colour-coded tokens in real time. Try typing a long technical word, or some code, or a sentence in another language. Notice how common everyday words stay as single tokens, while rare or compound words get split into pieces. This is exactly what happens inside ChatGPT before it processes your message."
  ],

  /* ── LESSON 03: Word Embeddings ── */
  '03': [
    "After tokenization we have numbers like 1024 and 9604. But these are just arbitrary ID numbers — like house numbers on a street. The number 1024 for 'king' and 1025 for 'queen' are numerically close but not semantically related. We need a richer representation that actually captures meaning. That is where word embeddings come in.",

    "An embedding transforms each token ID into a dense vector — a list of hundreds or thousands of floating-point numbers. Words with similar meanings end up with similar vectors. Think of it like GPS coordinates: just as two nearby cities have similar map coordinates, two related words have similar embedding vectors. In real models these vectors have 512, 768, or even 12,288 numbers — each number encoding a tiny piece of semantic information.",

    "Imagine a map of meaning. On this map, royalty words like king, queen, prince, and princess cluster together in one neighbourhood. Animal words like dog, cat, wolf, and lion form their own cluster nearby. Technology words — computer, laptop, phone — live in another district. Food words have their own corner of the map. Similar meanings are positioned close together; very different meanings are far apart.",

    "One of the most surprising properties of embeddings is that arithmetic works semantically. If you take the vector for 'king', subtract the vector for 'man', and add the vector for 'woman' — the result is very close to the vector for 'queen'. The embedding space has automatically learned that there is a gender direction in this space! Nobody programmed this in — the model discovered it purely from reading enormous amounts of text.",

    "Embeddings are not hand-crafted — they are learned automatically during training. The model starts with random vectors for every token. During training on billions of words, words that appear in similar contexts get nudged closer together. A famous quote in linguistics captures the idea: you shall know a word by the company it keeps. By the time training finishes, the vectors have self-organised into a rich semantic map.",

    "The scatter plot you see shows word embeddings projected down to two dimensions so we can visualise them. Even in 2D you can see clear clusters: royalty words grouped together, animals nearby, technology words in their own region. Hover over any dot to highlight it. In a real model these relationships exist across hundreds of dimensions, allowing the model to track far more nuanced semantic properties than we can draw on a flat screen."
  ],

  /* ── LESSON 04: The Sequence Problem ── */
  '04': [
    "Before Transformers, AI used Recurrent Neural Networks. An RNN processes a sentence one word at a time from left to right. After reading each word it updates a hidden state — a fixed-size memory vector that summarises everything seen so far. This is then passed to the next step. It is like reading a book while taking notes on a very small notepad — as new information arrives, old details inevitably get squeezed out.",

    "During training, neural networks learn by sending error signals backwards through the network via backpropagation. In an RNN, this signal must travel through every time step. For a long sentence with 50 words, the signal must pass through 50 steps. Each step weakens it slightly, until by the time the signal reaches the earliest words it is nearly zero. This vanishing gradient problem means early words have almost no influence on what the model learns.",

    "Here is a classic example of what RNNs struggle with. In the sentence 'The trophy did not fit in the suitcase because it was too big', what does 'it' refer to? To answer correctly you need to hold both 'trophy' and 'suitcase' in mind simultaneously when you reach 'it'. An RNN must compress all that prior context into one small vector, so by the time it reaches 'it', the specific details about 'trophy' versus 'suitcase' have been blurred together.",

    "RNNs also cannot be parallelised. To process word five you must finish words one through four first. This means you cannot use a modern GPU's parallel computing power effectively. A state-of-the-art GPU can perform thousands of operations simultaneously, but an RNN keeps it mostly idle, working through words one by one. Transformers solve this completely — they process all tokens simultaneously, making full use of GPU hardware.",

    "The comparison is stark. RNNs process text sequentially, struggle badly with long-range dependencies, train slowly, and underutilise modern GPUs. Transformers process everything in parallel, handle any distance between words equally well, train much faster, and maximise GPU utilisation. This difference in parallelism is a major reason why transformer-based models could suddenly be trained at scales of billions and then trillions of parameters.",

    "The solution to all these problems was elegant: instead of compressing the entire sentence history into one small vector, let every word directly communicate with every other word. No matter how far apart two words are, they can directly compare and exchange information in a single operation. This is the attention mechanism — and it changes everything. In the next lesson you will learn exactly how attention is calculated."
  ],

  /* ── LESSON 05: Attention Mechanism ── */
  '05': [
    "Attention is a mechanism that lets a model selectively focus on the most relevant parts of its input when processing each element. Humans do this naturally — when you read an ambiguous sentence, your eyes jump back to earlier parts for context. The attention mechanism gives neural networks this same ability to look across the whole input at once, weighting each part by how relevant it is.",

    "Here is a helpful analogy for attention. Think of it like searching a library. Your Query is what you are looking for — perhaps 'books about machine learning'. The Keys are the index cards on each shelf describing what is there. The Values are the actual books themselves. You compare your Query against all the Keys, find the closest matches, and retrieve content from those shelves. Attention is this exact lookup process, done with vectors and matrix multiplication.",

    "For each token we compute a similarity score between its Query vector and every Key vector in the sequence. The similarity is measured by the dot product — multiplying the vectors element-by-element and summing. A high dot product means high relevance. For example, when processing the word 'tired', its Query would score highly against the Key for 'animal' — because the model learns that what is tired is important context.",

    "Raw dot products can become very large, causing training instability. So we scale them down by dividing by the square root of the key dimension — typically 8 for 64-dimensional keys. Then we apply softmax, which squashes all scores into probabilities that sum to exactly one. These are the attention weights — a probability distribution telling us how much each token should contribute to the output.",

    "The final step is a weighted sum of the Value vectors using the attention weights. If 'tired' attends to 'animal' with 65 percent weight, to 'tired' itself with 20 percent, and to other words with smaller weights, then the output for 'tired' is mostly the Value of 'animal' blended with a smaller contribution from the others. The result is a new vector that has absorbed context from across the whole sentence.",

    "The complete attention formula is: Attention of Q, K, V equals softmax of Q times K-transpose, divided by the square root of d-k, multiplied by V. This elegant equation is executed in parallel for all tokens simultaneously using matrix multiplication. It is incredibly efficient on modern GPUs and forms the computational heart of every Transformer model built since 2017.",

    "A crucial property of attention is that it is differentiable — gradients flow through it cleanly during backpropagation. This means the model learns which things to attend to purely through gradient descent on training data. Nobody tells it that pronouns should attend to their referents, or that verbs should attend to their subjects. The model figures all of this out by itself, simply from the task of predicting the next word."
  ],

  /* ── LESSON 06: Self-Attention ── */
  '06': [
    "Self-attention is a special case of attention where the Queries, Keys, and Values all come from the same sequence — the sequence attends to itself. Every token asks: given my current representation, which other tokens in this same sentence are most relevant to me? This allows the model to understand relationships between all pairs of words simultaneously, in a single efficient operation.",

    "Each token's embedding is transformed into three different vector spaces by three learned weight matrices: W-Q produces the Query, W-K produces the Key, and W-V produces the Value. Think of these as three different projections of the same information. The Query says what I am looking for, the Key says what I have to offer, and the Value says what information I will actually share if someone attends to me.",

    "Let us trace through a simple three-word example: 'I love AI'. Each word gets an embedding vector. Each embedding is multiplied by the three weight matrices to produce Q, K, and V. Each Query is compared to all Keys via dot products to get attention scores. After dividing by the square root of the dimension and applying softmax, we have attention weights. We multiply weights by Values and sum — giving each word a new context-aware representation.",

    "After training, self-attention patterns reveal rich linguistic structure that emerges entirely from data. The word 'The' tends to attend strongly to the noun it precedes. A word like 'tired' attends to the subject that is tired. Pronouns attend to their referents. Subject verbs attend to their subjects for agreement. None of this structure was programmed — the model discovered these grammatical and semantic relationships purely by learning to predict text.",

    "The bar chart shows how the word 'tired' distributes its attention across the sentence 'The animal was tired'. Notice the tall bar for 'animal' — the model gives it 65 percent of the attention weight. This reflects the model learning that what is tired is the most semantically important context for that word. This is precisely how Transformers resolve ambiguous pronouns and understand complex relationships between distant words.",

    "Self-attention works for every type of linguistic relationship simultaneously. Coreference: connecting pronouns to their referents. Agreement: matching subjects to their verbs. Modification: linking adjectives to their nouns. Semantic relations: connecting 'Paris' to 'France'. The beauty is that the exact same mechanism handles all of these relationship types, and new patterns emerge naturally as the model trains on more data."
  ],

  /* ── LESSON 07: Multi-Head Attention ── */
  '07': [
    "A single attention head can only focus on one type of relationship at a time. But language is simultaneously rich with syntactic structure, semantic meaning, coreference chains, and positional patterns. A head that specialises in subject-verb agreement would miss coreference entirely. We need a way to capture many different types of relationships at the same time — from a single layer.",

    "The solution is Multi-Head Attention: running several independent attention mechanisms in parallel, each with its own learned weight matrices. Head one might specialise in syntactic relationships like subject-verb agreement. Head two might focus on semantic connections. Head three might learn coreference resolution. Head four might track positional proximity. GPT-3 uses 96 heads — finding 96 different types of patterns simultaneously in every layer.",

    "In Multi-Head Attention, each head independently computes attention using its own W-Q, W-K, and W-V matrices, producing an output vector. The outputs of all heads are concatenated side by side. Because each head works in a smaller d-k space — the model dimension divided by the number of heads — the total computation stays similar to one full-size attention head. A final weight matrix W-O then projects the concatenated output back to the original model dimension.",

    "The diagram shows four heads processing the same sentence in parallel. Head one captures syntax — subject to verb connections. Head two captures semantics — noun to its object. Head three resolves coreference — 'it' back to 'cat'. Head four notes positional proximity — words that are adjacent. Each head has learned a completely different lens for viewing the same text, and the final output combines all four perspectives.",

    "Multi-Head Attention is what gives Transformers their remarkable linguistic capability. Syntax, semantics, coreference, and discourse structure are all captured simultaneously in every layer — not sequentially. And crucially, the model itself decides which patterns each head should specialise in. This division of labour emerges automatically and spontaneously during training, without any human guidance about what each head should learn."
  ],

  /* ── LESSON 08: Positional Encoding ── */
  '08': [
    "Here is a subtle but critical problem: attention has no built-in sense of order. It treats all tokens equally regardless of their position in the sequence. This means 'Dog bites man' and 'Man bites dog' would look identical to a pure attention model — just the same three tokens in a different arrangement. But these sentences have completely different meanings! We must explicitly tell the model about word order.",

    "The original Transformer paper introduced Positional Encoding — a mathematical solution using sine and cosine functions at different frequencies. For each position and each dimension index, we compute either a sine or cosine of the position divided by a large number raised to a power. Even-numbered dimensions get a sine function, odd-numbered dimensions get a cosine. Different frequencies create a unique signal fingerprint for every position.",

    "Sine waves have beautiful mathematical properties for encoding position. Every position gets a completely unique combination of values — like a fingerprint. All values are bounded between negative one and positive one, keeping them on the same scale as the token embeddings. Most importantly, the relationship between any two positions can be expressed as a linear transformation — so the model can easily learn to recognise relative distances between words.",

    "The positional encoding is simply added — not concatenated — to the token embedding. So the input to the first layer is the sum of the token's meaning vector and its position signal. This means the word 'cat' at position three has a measurably different input from 'cat' at position seven. The attention mechanism can use these differences to infer word order and understand that position matters for meaning.",

    "The chart shows sinusoidal patterns for four different dimensions across 50 positions. Low-frequency dimensions change slowly, encoding coarse position like which half of the sentence a word is in. High-frequency dimensions oscillate rapidly, encoding fine-grained position like which specific word slot. Together they create a unique fingerprint for every position. Modern language models like LLaMA use an improved version called Rotary Position Encoding, but the fundamental idea of injecting position information remains the same."
  ],

  /* ── LESSON 09: The Encoder ── */
  '09': [
    "The encoder's job is to read the input sequence and build a deep, contextual understanding of it. It takes raw token embeddings plus positional encodings and transforms them through multiple layers into rich representations where each token's vector contains information about its relationship to every other token in the input. Think of it as a very thorough reading comprehension pass — getting smarter about the text with each layer.",

    "Each encoder layer has two sub-layers. The first is Multi-Head Self-Attention, which lets every token attend to every other token in the input. The second is a Feed-Forward Network — a two-layer neural network applied independently and identically to each token position. After each sub-layer, two additional operations run: a residual connection that adds the sub-layer input back to its output, and Layer Normalization that stabilises the values.",

    "Residual connections — also called skip connections — are one of the most important techniques in deep learning. After each sub-layer, instead of just using its output, we add it to the original input: output equals LayerNorm of x plus Sublayer of x. This shortcut lets gradients flow directly backwards through the entire network during training, preventing the vanishing gradient problem and making it practical to train very deep networks with dozens or even hundreds of layers.",

    "The Feed-Forward Network processes each position independently — the same two-layer network applied to every token separately, in parallel. It first expands the representation by a factor of four — from 512 to 2048 dimensions — applies a ReLU activation for non-linearity, then compresses back down to 512 dimensions. This expansion gives the model extra computational capacity. Think of it as a dedicated thinking step where each token digests its contextual information.",

    "The original Transformer stacks six encoder layers. Each layer refines the representations further. Early layers tend to capture surface-level patterns — nearby word associations and simple grammar. Middle layers develop more complex syntactic structure. Later layers capture abstract semantic relationships and long-range dependencies across the whole document. Modern language models stack between 32 and 120 layers, each adding progressively more nuanced understanding.",

    "The architecture diagram shows a complete encoder layer from bottom to top. Input enters at the bottom. Multi-Head Self-Attention runs first, its residual connection adding the original input back in, and Layer Norm stabilising the result. Then the Feed-Forward Network runs, with another residual connection and Layer Norm. The enriched output flows upward to the next encoder layer, carrying richer and richer contextual information about every token."
  ],

  /* ── LESSON 10: The Decoder ── */
  '10': [
    "The decoder generates the output sequence one token at a time. At each step it receives two inputs: the encoder's full contextual representation of the input, and all the tokens it has generated so far. From these it predicts a probability distribution over every possible next token. The most probable token is selected, appended to the sequence, and the process repeats until the special end-of-sequence token is generated.",

    "Unlike the encoder with two sub-layers, each decoder layer has three. First, Masked Self-Attention — the generated output tokens attend to each other, but with a causal mask preventing any token from seeing future tokens. Second, Cross-Attention — the decoder attends to the encoder's output, which is how it reads the input context. Third, a Feed-Forward Network identical to the one in the encoder. All three sub-layers have residual connections and layer normalization.",

    "Masking is essential for correct training. During training we process all output tokens in parallel for efficiency, but we must prevent each token from cheating by looking at tokens that come after it — because at generation time, those future tokens do not yet exist. We apply a causal mask: when computing attention scores for position i, we set all scores for positions greater than i to negative infinity before softmax. This forces the attention weights for future positions to be exactly zero.",

    "Cross-attention is where the magic connection between encoder and decoder happens. The Queries come from the decoder's current representation — what the decoder is actively trying to generate. But the Keys and Values both come from the encoder's output — the fully contextualised representation of the input. The decoder is essentially asking: given what I have generated so far, which part of the input is most relevant to deciding my next word?",

    "At inference time the decoder works one token at a time. It starts with a special beginning-of-sequence token. It runs a forward pass through all decoder layers, producing a probability distribution over the entire vocabulary. It samples or takes the top token — say 'Hello'. It appends that token to the sequence and runs again, getting 'world'. It continues until it generates the end-of-sequence token. This sequential generation is why language models produce text word by word.",

    "After the final decoder layer, a linear projection maps the high-dimensional output vector to a logits vector with one value per vocabulary token — over 50,000 values for GPT-style models. Applying softmax converts these logits into probabilities that sum to one. We then select the next token either greedily by taking the highest probability, or by sampling with a temperature parameter that controls randomness and creativity.",

    "The architecture diagram shows the complete decoder layer. Masked self-attention at the bottom handles the previously generated tokens. Cross-attention in the middle — fed by the encoder's output shown entering from the left — is the bridge to the input context. The feed-forward network at the top processes the combined information. The linear and softmax output layers at the very top transform everything into a vocabulary-wide probability distribution for the next token."
  ],

  /* ── LESSON 11: Full Transformer ── */
  '11': [
    "Let us bring everything together into the complete picture. The input sequence is tokenised, embedded, and combined with positional encoding, then processed through N encoder layers — each with self-attention and a feed-forward network. The encoder outputs a rich contextual representation of every input token. Simultaneously, on the decoder side, the output sequence grows token by token, guided by both its own masked self-attention and cross-attention to the encoder.",

    "This architecture diagram shows both sides at once. The encoder stack on the left processes the full input. The decoder stack on the right generates the output. The connecting arrow in the middle represents cross-attention — the moment where the decoder reads from the encoder. This simple diagram, first published in a Google paper in 2017, has become one of the most influential architectural blueprints in the history of computing.",

    "Not all Transformers use both encoder and decoder. BERT, released by Google in 2018, uses only the encoder stack. Because the encoder is bidirectional — every token attends to all other tokens in both directions — it excels at deeply understanding existing text. BERT and its successors like RoBERTa and DeBERTa power search engines, text classifiers, named entity recognition systems, and reading comprehension models.",

    "GPT and its successors — including Claude, Gemini, and LLaMA — use only the decoder stack. The causal masking that was needed for training in the encoder-decoder setup becomes the defining feature of these models. Trained on massive amounts of text to predict the next token at enormous scale, these decoder-only models develop surprisingly broad and general capabilities: writing, reasoning, coding, and conversation.",

    "Training a large language model happens in stages. First, pre-training: the model sees trillions of tokens of internet text and learns to predict the next token. This is self-supervised — no human labels are needed, just raw text. The model learns language, world knowledge, and reasoning patterns purely from prediction. Second, supervised fine-tuning on examples of helpful behaviour. Third, reinforcement learning from human feedback, where human raters teach the model to produce responses people actually prefer.",

    "The scale of modern language models is staggering. GPT-2 in 2019 had 1.5 billion parameters. GPT-3 in 2020 jumped to 175 billion. Estimated GPT-4 has around one to two trillion parameters. Context windows grew from 1,000 tokens to 128,000 and beyond. Training runs cost tens of millions of dollars. Yet the underlying architecture — the same Transformer from 2017 — remains essentially unchanged. More scale applied to the same design has produced qualitative leaps in capability.",

    "Congratulations — you have completed the entire Transformer Explained course! You now understand tokenization, word embeddings, positional encoding, the attention mechanism, self-attention, multi-head attention, the encoder, the decoder, and how they all combine into the full Transformer architecture. This is the actual technology powering ChatGPT, Claude, Gemini, and every other major AI language model in use today. You went from zero to understanding the fundamental mechanism of modern AI. Well done!"
  ]

}; // end window.NARRATIONS
