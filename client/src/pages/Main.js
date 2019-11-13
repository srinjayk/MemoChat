import React from "react";
import { ScrollView, StyleSheet, Text, View, Button, TextInput } from "react-native";
import FormData from 'FormData';
import {Actions} from 'react-native-router-flux';
import email from 'react-native-email';

export default class Main extends React.Component {

    constructor(prop) {
        super(prop);
        this.getUserById = this.getUserById.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.tryPost = this.tryPost.bind(this);
        this.state = {
            itemList : [],
            puname: '',
            text: '',
            postnumber:'',
            subject:'',
            delete_post:'',
            update_text:'',
            update_post:'',
            delete_owner:'',
            update_owner:'',
            id:[],
            recipient:'',
            email_subject:'',
            email_body:''
        }
    }

    goback() {
        global.active_user=''
        global.active_user_id=''
        Actions.pop()
      }
    componentDidMount() {
        fetch('http://172.27.27.10:3000/api/posts')
              .then((response) => response.json())
                  .then((responseJson) => {
                      // var data = JSON.parse(responseText);
                      // alert(responseJson.id);
                      this.setState({
                          itemList: responseJson
                      });
                  })
                  .catch(function (err) {
                      alert("Memos not loaded ..." + err);
                  })
    }


    refreshPosts = () => {
        fetch('http://172.27.27.10:3000/api/posts')
              .then((response) => response.json())
                  .then((responseJson) => {
                      // var data = JSON.parse(responseText);
                      // alert(responseJson.id);
                      this.setState({
                          itemList: responseJson,
                          text: ''
                      });
                  })
                  .catch(function (err) {
                      alert("Memos not loaded ..." + err);
        })
    }
    getUserById = (arg) => {
        // alert('getUserBYId');
        fetch('http://172.27.27.10:3000/auth/idtousername/'+arg)
              .then((responsep) => responsep.json())
                  .then((responsepJson) => {
                    //   alert(typeof(responsepJson.user));
                    this.setState({
                        puname : responsepJson.user
                    })
                  })
                  .catch(function (err) {
                      alert("Memos not loaded ..." + err);
                  })
    }
    // renderItem = () => {
    //     return this.state.itemList.map(item => (
    //         <View key={item._id} style={{justifyContent: "center", alignItems: "center"}} class="tweet">
                
    //             <View style={styles.post} class="tweet_post">
    //                 <Text class="tweet_text">Id : {item._id}</Text>
    //                 <Text class="tweet_text">Post : {item.text}</Text>
    //                 <Text class="tweet_text">Created by : {item.created_by}</Text>
    //                 <Text class="tweet_text">PostNumber : {item.postnumber}</Text>
    //                 <Text class="tweet_text">Subject : {item.subject}</Text>
    //                 <Button title="Delete" style={styles.button1} onPress={this.tryDelete}/>
    //             </View>
    //         </View>
    //     ));
    // }

    renderItem = () => {
        const listItem = this.state.itemList.map((item) => {
            return <View key={item._id} style={{justifyContent: "center", alignItems: "center"}} class="tweet">
                        <View style={styles.post} class="tweet_post">
                            <Text class="tweet_text" style={styles.textstyle_2}>Created by : {item.created_by}</Text>
                            <Text class="tweet_text" style={styles.textstyle_2}>Memo : {item.text}</Text>
                            
                            <Text class="tweet_text" style={styles.textstyle_2}>Subject : {item.subject}</Text>
                            <Text class="tweet_text"></Text>
                            <Button title="Delete" style={styles.button1} onPress={this.delete.bind(this, item)}/>
                            <Text style={styles.textstyle_4}>Updated Memo</Text>
                            <TextInput
                                style = {styles.inputbox_1}
                                placeholder="Updated memo"
                                onChangeText={(update_text) => this.setState({update_text})}
                                value={this.state.update_text}
                            />
                            <Button title="Update" style={styles.button1} onPress={this.update.bind(this, item)}/>
                        </View>
                    </View>
            })
            return (<View>
                {listItem}
            </View>)
    }

    // renderItem = () =>{
    //     const listItem = this.state.itemList.map((item)=>{
    //         return <View><div key={item._id}>
    //             <span>{item.text}</span> <button onClick={this.delete.bind(this, item)}>Delete</button>
    //             </div>
    //             </View>
    //     })
    //     return (<View><div>
    //         {listItem}
    //     </div></View>)
    // }

    tryPost = () => {
        // alert('Got logged in');
            // alert(global.active_user_id);
            var body1 = JSON.stringify({
                text:this.state.text,
                created_by: global.active_user,
                subject: this.state.subject
              })
            // alert(body1)
          fetch('http://172.27.27.10:3000/api/posts/', {
            method: 'POST',
            headers: { 'Accept': 'application/json','Content-Type': 'application/json',},
            body: body1
          })
          .then((response1) => response1.text())
            .then((response1Text) => {
                 var data = JSON.parse(response1Text);
                 alert('Memo Created!')
                 this.refreshPosts()
            })
          .catch(function(error) {
            console.log(error)
            alert('There has been a problem with your fetch operation: ' + error.message);
          });
    
      }

      tryEmail = () => {
        // alert('Got logged in');
            // alert(global.active_user_id);
        if(this.state.recipient !== global.active_user){
            const to = this.state.recipient+'@iitk.ac.in' // string or array of email addresses
            email(to, {
                // Optional additional arguments
                cc: '', // string or array of email addresses
                bcc: '', // string or array of email addresses
                subject: this.state.email_subject,
                body: this.state.email_body
            })
        }
        else{
            alert('You cannot mail yourself')
        }

    
      }

    tryDelete = () => {
        // alert('Got logged in');
        // if(global.active_user == this.delete_owner){
            // alert(global.active_user_id);
            var body1 = JSON.stringify({
                owner:this.delete_post
            })
            fetch('http://172.27.27.10:3000/api/posts/:id', {
                method: 'DELETE',
                headers: { 'Accept': 'application/json','Content-Type': 'application/json',},
                body: body1
            })
            .then((response1) => response1.text())
                .then((response1Text) => {
                    var data = JSON.parse(response1Text);
                    alert('Deleted!')
                    this.refreshPosts()
                })
            .catch(function(error) {
                console.log(error)
                alert('There has been a problem with your fetch operation: ' + error.message);
            });
        // }
        // else{
        //     alert('You cannot delete it');
        // }
      }

    // shorter & readable 
  delete(item){
    // alert(item.created_by)
    // const data = this.state.itemList.filter(i => i._id !== item._id)
    // this.setState({data})
    // alert("jhggvjghvjhgv")
    if(item.created_by === global.active_user){
        var body1 = JSON.stringify({
                owner:item._id
            })
            fetch('http://172.27.27.10:3000/api/posts/:id', {
                method: 'DELETE',
                headers: { 'Accept': 'application/json','Content-Type': 'application/json',},
                body: body1
            })
            .then((response1) => response1.text())
                .then((response1Text) => {
                    var data = JSON.parse(response1Text);
                    alert('Deleted!')
                    this.refreshPosts()
                })
            .catch(function(error) {
                console.log(error)
                alert('There has been a problem with your fetch operation: ' + error.message);
            });
    }
    else{
        alert("You cannot delete this post as it is not created by you")
    }
  }

  update(item){
    // alert(item.created_by)
    // const data = this.state.itemList.filter(i => i._id !== item._id)
    // this.setState({data})
    // alert("jhggvjghvjhgv")
    if(item.created_by === global.active_user){
        var body1 = JSON.stringify({
                owner:item._id,
                created_by:item.created_by,
                text:this.state.update_text,
                subject:item.subject
            })
            fetch('http://172.27.27.10:3000/api/posts/:id', {
                method: 'PUT',
                headers: { 'Accept': 'application/json','Content-Type': 'application/json',},
                body: body1
            })
            .then((response1) => response1.text())
                .then((response1Text) => {
                    var data = JSON.parse(response1Text);
                    alert('Updated')
                    this.refreshPosts()
                })
            .catch(function(error) {
                console.log(error)
                alert('There has been a problem with your fetch operation: ' + error.message);
            });
    }
    else{
        alert("You cannot modify this post as it is not created by you")
    }
  }

    render() {
        return (
            <ScrollView>
                <Text style={styles.textstyle}>Username :  {global.active_user}</Text>

                <Text style={styles.textstyle}>Memos by you and your friends!!!</Text>
                
                <ScrollView contentContainerStyle={{flex: 0,justifyContent: 'space-between'}} >
                    <View>{this.renderItem()}</View>
                </ScrollView>

                

                <View style={styles.heading}>
                    <Text style={styles.textstyle_1}>Create your own memo!!</Text>
                    <Text></Text>
                    <Text style={styles.textstyle_3}>New Memo</Text>
                    <TextInput
                    style={styles.inputbox}
                    placeholder="Enter the Memo"
                    onChangeText={(text) => this.setState({text})}
                    value={this.state.text}
                    />
                    <Text style={styles.textstyle_3}>Subject for Memo</Text>
                    <TextInput
                    style={styles.inputbox}
                    placeholder="Enter the subject"
                    onChangeText={(subject) => this.setState({subject})}
                    value={this.state.subject}
                    />
                    <Button title="Create" style={styles.button1} onPress={this.tryPost}/>
                    
                    <Text></Text>
                    
                    <Text style={styles.textstyle_1}>Mail your Friends!!!!</Text>
                    <Text></Text>
                    <Text style={styles.textstyle_3}>Recipient</Text>
                    <TextInput
                    style={styles.inputbox}
                    placeholder="Enter the Recipient"
                    onChangeText={(recipient) => this.setState({recipient})}
                    value={this.state.recipient}
                    />
                    <Text style={styles.textstyle_3}>Subject for Email</Text>
                    <TextInput
                    style={styles.inputbox}
                    placeholder="Enter the subject"
                    onChangeText={(email_subject) => this.setState({email_subject})}
                    value={this.state.email_subject}
                    />
                    <Text style={styles.textstyle_3}>Body for Email</Text>
                    <TextInput
                    style={styles.inputbox}
                    placeholder="Body"
                    onChangeText={(email_body) => this.setState({email_body})}
                    value={this.state.email_body}
                    />
                    <Button title="Mail" style={styles.button1} onPress={this.tryEmail}/>
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
            // borderRadius:4,
            marginBottom:10,
            marginTop:10,
            color:"white",
            padding:10
        },
        textstyle_1:{
            backgroundColor : "black",
            alignItems: "center",
            fontSize: 20,
            borderRadius:4,
            marginBottom:10,
            marginTop:10,
            color:"white",
            padding:10
        },
        textstyle_2:{
            color:"white",
            fontSize:20,
            padding:2,
            marginTop:2,
            width:250,
            backgroundColor:"#666666"
        },
        textstyle_3:{
            // backgroundColor : "black",
            alignItems: "center",
            fontSize: 20,
            borderRadius:4,
            marginBottom:10,
            marginTop:10,
            color:"#666666"
        },
        textstyle_4:{
            // backgroundColor : "black",
            alignItems: "center",
            fontSize: 20,
            borderRadius:4,
            marginBottom:10,
            marginTop:10,
            color:"#ffffff"
        },
        heading:{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 80,
            marginBottom: 50
        },
        post:{
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            includeFontPadding: true,
            fontSize: 25,
            padding: 5,
            fontWeight: 'bold',
            backgroundColor: "#666666",
            color: "yellow",
            borderColor: "yellow",
            borderRadius: 10,
            width:350,
            marginBottom: 5,

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
        inputbox_1: {
            height: 45,
            width: 300,
            padding: 10,
            borderRadius: 4,
            borderColor: "yellow",
            borderWidth:1,
            marginBottom:5,
            backgroundColor: "white"
        },
        button1:{
            width: 300,
            backgroundColor:"black",
            color:"red",
            borderRadius:10
        },
        end:{
            height: 50,
            alignItems:"center",
            fontSize : 20,

        }
  });
