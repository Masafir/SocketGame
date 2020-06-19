import React,{useState,useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';
import styled from 'styled-components';


const Chat = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  &{
    -ms-overflow-style: none;
  }
  
`;
const Input = styled.input`
  width: 50%;
  padding: 5px;
`;
const Button = styled.button`
  width: 140px;
  padding: 8px;
  border: none;
  background-color: black;
  color: white;
  margin: 0px 5px;
  transition: letter-spacing 0.5s;
  &:hover{
    letter-spacing: 2px;
  }
`;
const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const Form = styled.form`
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;

`;
const View = styled.div`
  height: 90vh;
  display: flex;
  width: 100%;
  margin: 5px auto;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const Message = styled.div`
  width: 100%;
  display: flex;
  padding: 5px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
`;
const Pseudo = styled.div` 
  width: 20%;
  font-weight: 900;
  margin: 0 5px;
`;
const Text = styled.div` 
  width: 80%;
  word-break: break-word;
  margin: 0 5px;
`;
class App extends React.Component {
  constructor(props)
  {
    super(props);
    this.state= {
      pseudo: "",
      message: "",
      connected: false,
      messages: [],
    }
    this.socket = io.connect('http://localhost:8080');
  }

  componentDidMount(){
    var self = this;
    const { messages } = this.state;
    self.socket.on('message', function(data) {
      console.log("on a un message : ",data);
      let oldMessage = messages;
      oldMessage.push({pseudo: data.pseudo,message: data.message});
      self.setState({messages: oldMessage});
    })
    self.socket.on('nouveau_client', function(data) {
      console.log("on a un nouvel utilisateur : ",data);
      let oldMessage = messages;
      oldMessage.push({pseudo: "admin",message: `${data} à rejoins ce beau chatte !`});
      self.setState({messages: oldMessage});
    })
  }

  handleChange = (e) => {

    if( e.target.name)
    {
      this.setState({[e.target.name]: e.target.value});
    }
  } 
  handleSubmit = (e) => {
    e.preventDefault();
    const {pseudo,message,messages} = this.state;
    if(message.length > 0){
      this.setState({message: ""});
      this.socket.emit('message', message);
    }
    else if(pseudo)
    {
      this.setState({connected: true});
      this.socket.emit('nouveau_client',pseudo);
    }
  }

render(){
  const {pseudo,message,messages,connected} = this.state;

  return (
    <View>
      <Container className="Container">
      {
            connected ? 
          <Chat>
            {messages.map(msg => <Message> <Pseudo> {msg.pseudo} </Pseudo><Text> {msg.message} </Text></Message>)}
          </Chat>:
          null
      }
        <Form onSubmit={e => this.handleSubmit(e)}>
          {
            connected ? 
            <Input onChange={e => this.handleChange(e)} value={message} name="message" placeholder="Met un message mec" />
            :
            <Input onChange={e => this.handleChange(e)} value={pseudo} name="pseudo" placeholder="Met ton pseudo mec" />
          }
          <Button type="submit"> CONFIRMATION </Button>
        </Form>
      </Container>
    </View>
  );
}
}

export default App;
