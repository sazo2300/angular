import React, { Component } from 'react';
import { View, StyleSheet, Clipboard } from 'react-native';
import { State } from '../reducers'
import { LoginButton, AccessToken } from 'react-native-fbsdk';
import { setUserState, setUserToken } from '../actions/users';
import { getUser } from '../selectors/user'
import { store, persistor } from '../store/index'
import User, { UserState } from '../models/User';
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
                        store.dispatch(setUserToken(data.accessToken.toString()));
                        store.dispatch(setUserState(UserState.Consumer));
                        let storeState = store.getState();
                        let user = getUser(storeState);
                        this.props.setParentState({user: user})
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
              store.dispatch(setUserToken(null));
              store.dispatch(setUserState(UserState.Anonymous));
              let storeState = store.getState();
              let user = getUser(storeState);
              this.props.setParentState({user: user})
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
