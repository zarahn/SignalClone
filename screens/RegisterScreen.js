import React, {useLayoutEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Input, Text} from 'react-native-elements';
import {KeyboardAvoidingView} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {auth} from "../firebaseConfig";

const RegisterScreen = ({navigation}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: 'Back To Login',
        })
    }, [navigation]);

    const register = () => {
        auth.createUserWithEmailAndPassword(email, password)
            .then(authUser => {
                authUser.user.updateProfile({
                    displayName: name,
                    photoURL: imageUrl || 'https://img.icons8.com/ios-filled/452/signal-app.png'
                });
            })
            .catch((error) => alert(error.message));
    };

    return (
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
            <StatusBar style='light' />
            <Text h3 style={{ marginBottom: 50 }}>Create a Signal account</Text>
            <View style={styles.inputContainer}>
                <Input type='text' autoFocus placeholder='Fullname' value={name} onChangeText={(text) => setName(text)} />
                <Input type='email' placeholder='Email' value={email} onChangeText={(text) => setEmail(text)} />
                <Input type='password' secureTextEntry placeholder='Password' value={password} onChangeText={(text) => setPassword(text)} />
                <Input type='text' placeholder='Profile Pic URL (optional)' value={imageUrl} onChangeText={(text) => setImageUrl(text)}
                       onSubmitEditing={register}/>
            </View>
            <Button raised title='Register' onPress={register} />
            <View style={{ height: 100 }} />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        width: '100%',
        backgroundColor: '#FAFAFA',
    },
    inputContainer: {
        width: 200,
        marginTop: 10,
    },
    button: {
        width: 300,
    },
});

export default RegisterScreen;

