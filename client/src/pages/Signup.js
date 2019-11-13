import React from "react";
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity,ScrollView } from "react-native";
import {Actions} from 'react-native-router-flux';

import FormData from 'FormData';

export default class Signup extends React.Component {
  state = {
    username: null,
    password: null,
    password2: null,
    email:null
  };

  goback() {
    Actions.pop()
  }

 trySignup = () => {
    // alert('Got logged in');
    // var formData = new FormData();
    // formData.append('username', this.state.username);
    // formData.append('password', this.state.password);
    // formData.append('password2', this.state.password2);
    // formData.append('email',this.state.email);
    // alert(this.state.email);
    if(this.state.password === this.state.password2){
      var body1 = JSON.stringify({
            username: this.state.username,
            password: this.state.password,
            // password2: this.state.password2,
            // email: this.state.email,
          })
        // alert(this.state.username+'  '+this.state.password);
        fetch('http://172.27.27.10:3000/auth/signup', {
          method: 'POST',
          headers: { 'Accept': 'application/json','Content-Type': 'application/json',},
          body:body1
        })
        // console.log(this.state.username)
        .then((response) => response.text())
          .then((responseText) => {
              var data = JSON.parse(responseText);
              alert(data.state)
          })
        .catch(function(error) {
          console.log(error)
          alert('There has been a problem with your fetch operation: ' + error.message);
        });
      }
      else{
        alert("Passwords do not match")
      }

  }

  render() {
    return (
      <ScrollView>
      <View style={styles.container}>
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.textstyle}>Username</Text>
          <TextInput
            style={styles.inputbox}
            placeholder="username"
            onChangeText={(username) => this.setState({username})}
            value={this.state.text}
          />
          <Text style={styles.textstyle}>Password</Text>
          <TextInput
            style={styles.inputbox}
            secureTextEntry={true}
            placeholder="Enter Your Password"
            onChangeText={(password) => this.setState({password})}
          />
          <Text style={styles.textstyle}>Confirm Your Password</Text>
          <TextInput
            style={styles.inputbox}
            secureTextEntry={true}
            placeholder="Confirm your Password"
            onChangeText={(password2) => this.setState({password2})}
          />
          <Text style={styles.textstyle}>Email</Text>
          <TextInput
            style={styles.inputbox}
            placeholder="Email"
            onChangeText={(email) => this.setState({email})}
            value={this.state.text}
          />
          <Button title="Signup" style={styles.button1} onPress={this.trySignup}/>
        </View>
        <View style={styles.buttonview}>
            <Text style={{ marginBottom: 20 }}>Already have an account? </Text>
            <Button title="Login" style={styles.button1} onPress={this.goback}/>
            <Text style={{ marginTop: 20, marginBottom: 20 }}>'\n'</Text>
        </View>
      </View>
      </ScrollView>
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
