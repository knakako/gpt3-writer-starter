import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const basePromptPrefix = `This is an AMA(ask me anything) with Niccolò Machiavelli. Please respond to a question below in his way of thinking, referencing his experience in his time.
 Question:`;
const generateAction = async (req, res) => {
    //Run first prompt
    console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

    const baseCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${basePromptPrefix}${req.body.userInput}`,
        temperature: 0.8,
        max_tokens: 500,
    });

    const basePromptOutput = baseCompletion.data.choices.pop();

    //I build prompt #2.
    const secondPrompt =
        `
    Take the answer below and generate a letter written in the unique style of Niccolò Machiavelli.
    
    Question:${req.body.userInput}
    Answer: ${basePromptOutput.text}
    `
    //I call the OpenAI API a second time with Prompt #2
    const secondPromptCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${secondPrompt}`,
        //I set a higher temperature for this one. Up to you!
        temperature: 0.85,
        max_tokens: 500
    })

    //get the output
    const secondPromptOutput = secondPromptCompletion.data.choices.pop();
    //send over the prompt #2's output to our UI instead of Prompt #1's.
    res.status(200).json({ output: secondPromptOutput });

};

export default generateAction;