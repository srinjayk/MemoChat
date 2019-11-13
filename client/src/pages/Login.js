import React from "react";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import FormData from 'FormData';
import {Actions} from 'react-native-router-flux';

export default class Login extends React.Component {
  state = {
    username: null,
    password: null,
    id: null
  };


  signup = () => {
    Actions.signup()
  }

  main = () => {
    Actions.main()
  }

 tryLogin = () => {
    // alert('Got logged in');
    var formData = new FormData();
    formData.append('username', this.state.username);
    formData.append('password', this.state.password);
      // alert(this.state.username+'  '+this.state.password);

      fetch('http://172.27.27.10:3000/auth/login', {
        method: 'POST',
        headers: { 'Accept': 'application/json','Content-Type': 'application/json',},
        body:JSON.stringify({
          username: this.state.username,
          password: this.state.password,
        })
      })
      .then((response) => response.text())
        .then((responseText) => {
             var data = JSON.parse(responseText);
             if(data.state === 'success'){
              global.active_user = this.state.username;
              // GetUserId(this.state.username);
              fetch('http://172.27.27.10:3000/auth/success/'+this.state.username)
              .then((responsed) => responsed.json())
                  .then((responsedJson) => {
                      // var data = JSON.parse(responseText);
                      // alert(responseJson.id);
                      global.active_user_id = responsedJson.id;
                      Actions.main()
                  })
             }else{
               alert(data.state)
             }
        })
      .catch(function(error) {
        console.log(error)
        console.log('There has been a problem with your fetch operation: ' + error.message);
      });

  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.textstyle}>Username</Text>
          <TextInput
          style={styles.inputbox}
          placeholder="Username"
          onChangeText={(username) => this.setState({username})}
          value={this.state.text}
          />
          <Text style={styles.textstyle}>Password</Text>
          <TextInput secureTextEntry={true} placeholder="Password" style={styles.inputbox} onChangeText={(password) => this.setState({password})}/>
          <View style={styles.buttonview}>
            <Button title="Login" style={styles.button1} onPress={this.tryLogin}/>
          </View>
          <View style={styles.buttonview}>
            <Text style={{ marginTop: 20, marginBottom: 20 }}>'\n'</Text>
            <Button title="Signup" style={styles.button1} onPress={this.signup}/>
          </View>
        </View>        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textstyle:{
    backgroundColor : "black",
    alignItems: "center",
    fontSize: 20,
    borderRadius:4,
    marginBottom:10,
    marginTop:10,
    color:"white"
  },
  container: {
    flex: 10,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center"
  },
  inputbox: {
    height: 45,
    width: 300,
    padding: 10,
    borderRadius: 4,
    borderColor: "yellow",
    borderWidth:1,
    marginBottom: 20,
    backgroundColor: "white"
  },
  button1:{
    width: 300,
    backgroundColor:"black",
    color:"red",
    borderRadius:10
  },
  buttonview:{
    backgroundColor:"black"
  }
});
