import React, { Component } from 'react';
import { View, StyleSheet, Clipboard } from 'react-native';
import { LoginButton, AccessToken } from 'react-native-fbsdk';
import RNFirebase from 'react-native-firebase'

export default class FBLoginButton extends Component<any, any> {

  constructor(props: any){
    super(props);
}

  render() {
    return (
      <View style={styles.container}>
        <LoginButton
          readPermissions={["public_profile email"]}
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert("Login failed with error: " + error);
              } else if (result.isCancelled) {
                alert("Login was cancelled");
              } else {
                AccessToken.getCurrentAccessToken().then(
                    (data) => {
                      const credentials = RNFirebase.auth.FacebookAuthProvider.credential(data.accessToken);
                      RNFirebase.auth().signInAndRetrieveDataWithCredential(credentials)
                      .then((response) => {
                        //dispatch accesstoken to parent state and redux store
                        console.log("\n\n\nTOKEN: " + data.accessToken.toString());
                        alert("Login was successful with permissions: " + result.grantedPermissions)
                      })
                      .catch((error) => {
                        alert("Error signing in!: " + error.message);
                      });
                    }
                  )
              }
            }
          }
          onLogoutFinished={() => 
            {
              alert("User logged out")
              //remove accesstoken by dispatching to parent state and redux store
            }
          }/>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});
