import React, { Component } from 'react';
// import * as openai from 'openai';

interface IChatbotState {
  messages: IMessage[];
  inputText: string;
}

interface IMessage {
  text: string;
  isBot: boolean;
}

class Chatbot extends Component<{}, IChatbotState> {
  private chatbotToken: string = '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';
  private chatbotModel: string = 'davinci';

  constructor(props: {}) {
    super(props);
    this.state = {
      messages: [],
      inputText: ''
    };
  }

  async componentDidMount() {
    // const client = new openai.Auth({ api_key: this.chatbotToken });
    // const messages = this.state.messages;
    // messages.push({
    //   text: "Hi! I'm a chatbot. How can I assist you today?",
    //   isBot: true
    // });
    // this.setState({ messages });
  }

  async sendMessage() {
    // const client = new openai.Auth({ api_key: this.chatbotToken });
    // const messages = this.state.messages;
    // messages.push({ text: this.state.inputText, isBot: false });
    // this.setState({ messages, inputText: '' });

    // try {
    //   const response = await openai.Completion.create({
    //     engine: this.chatbotModel,
    //     prompt: messages.map((message) => message.text).join('\n') + '\nBot:',
    //     max_tokens: 150,
    //     n: 1,
    //     stop: 'Bot:',
    //     temperature: 0.5
    //   });

    //   messages.push({ text: response.choices[0].text.trim(), isBot: true });
    //   this.setState({ messages });
    // } catch (err) {
    //   console.error(err);
    // }
  }

  handleInputTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputText: event.target.value });
  };

  handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  };

  render() {
    return (
      <div className="chatbot-container">
        <div className="chatbot-messages">
          {this.state.messages.map((message, index) => (
            <div className={`chatbot-message ${message.isBot ? 'bot' : 'user'}`} key={index}>
              <div className="chatbot-message-text">{message.text}</div>
            </div>
          ))}
        </div>
        <div className="chatbot-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={this.state.inputText}
            onChange={this.handleInputTextChange}
            onKeyDown={this.handleKeyDown}
          />
        </div>
      </div>
    );
  }
}

export default Chatbot;
