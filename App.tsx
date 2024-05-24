import React, { useEffect, useState } from "react";
import { SafeAreaView, View, TouchableOpacity, Text, Image, TextInput, Dimensions, Alert, StyleSheet } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  appleAuth,
} from "@invertase/react-native-apple-authentication";
var appleCredential: any = null;
var appleId: string = "";
import auth from "@react-native-firebase/auth";
const { width } = Dimensions.get('window');

const App = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId:
        "iOSClientId",
      webClientId:
        "webClientId",
    });
  }, []);

  const onGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const { idToken, user } = await GoogleSignin.signIn();
      Alert.alert("Success", JSON.stringify(user))
    } catch (error) {
      console.log("error", error);
    }
  };

  const onAppleButtonPress = async () => {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    if (!appleAuthRequestResponse.identityToken) {
      throw new Error("Apple Sign-In failed - no identify token returned");
    }

    const { identityToken, nonce } = appleAuthRequestResponse;
    appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

    appleId = appleAuthRequestResponse?.user;
    console.log(appleAuthRequestResponse?.user);
    console.log("appleUser", appleAuthRequestResponse);
  };

  return (
    <SafeAreaView style={styles.container}>

      <Image style={styles.imageLogo}
        source={{ uri: 'https://cdn1.iconfinder.com/data/icons/soleicons-fill-vol-1/64/reactjs_javascript_library_atom_atomic_react-512.png' }} />

      <Field hint={"Email"} value={email} onChangeText={setEmail} containerStyle={{ marginTop: 40, }} />
      <Field hint={"Password"} value={password} onChangeText={setPassword} containerStyle={{ marginTop: 10, }} />

      <ButtonComponent title={"Sign in"} containerStyle={styles.buttonSignIn} />

      <View style={styles.viewSocialOptions}>
        <ButtonComponent title={"Sign in with google"} containerStyle={{ backgroundColor: 'red', marginEnd: 10, flex: 1, }}
          onPress={() => onGoogleLogin()} />
        <ButtonComponent title={"Sign in with apple"} containerStyle={{ backgroundColor: 'red', marginStart: 10, flex: 1, }}
          onPress={() => onAppleButtonPress()}
        />
      </View>
    </SafeAreaView>
  )
}

const Field = ({ value, hint, containerStyle, onChangeText }: any) => {
  return (
    <TextInput value={value}
      placeholder={hint}
      onChangeText={onChangeText}
      style={[styles.textInputField, containerStyle]} />
  )
}

const ButtonComponent = ({ title, onPress, containerStyle }: any) => {
  return (
    <TouchableOpacity style={[styles.touchButtonContainer, containerStyle]} onPress={onPress}>
      <Text style={styles.textButtonTitle}>{title}</Text>
    </TouchableOpacity>
  )
}
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  imageLogo: {
    height: 80,
    width: 80,
    alignSelf: 'center',
    marginTop: 100
  },
  buttonSignIn: {
    backgroundColor: 'red',
    marginEnd: 10,
    marginTop: 10,
    height: 60,
    width: width - 32,
    alignSelf: 'center'
  },
  viewSocialOptions: {
    height: 60,
    flexDirection: 'row',
    paddingStart: 16,
    paddingEnd: 16,
    marginTop: 10,
  },

  textInputField: {
    height: 60,
    width: width - 32,
    alignSelf: 'center',
    borderRadius: 10,
    borderColor: 'grey',
    borderWidth: .5,
    paddingStart: 10,
  },

  touchButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textButtonTitle: {
    color: 'white',
    fontSize: 14
  }
})