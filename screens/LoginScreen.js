import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button, Input, Image} from 'react-native-elements';
import {KeyboardAvoidingView} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {auth} from "../firebaseConfig";


const LoginScreen = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const subscription = auth.onAuthStateChanged((authUser) => {
            console.log(authUser);
            if (authUser) {
                navigation.replace('Home');
            }
        });
        return subscription;
    }, []);

    const signIn = () => {
        auth.signInWithEmailAndPassword(email,password).catch(error => alert(error));
    };

    return (
        <KeyboardAvoidingView behavior='padding' style={styles.centerContainer}>
            <StatusBar style='light' />
            <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Signal-Logo.svg/1200px-Signal-Logo.svg.png' }} style={{ width: 200, height: 200 }} />
            <View style={styles.inputContainer}>
                <Input placeholder='Email' type='email' value={email} onChangeText={(text) => setEmail(text)} />
                <Input placeholder='Password' type='password' secureTextEntry value={password}
                       onChangeText={(text) => setPassword(text)}
                       onSubmitEditing={signIn} />
            </View>
            <Button containerStyle={styles.button} title='Login' onPress={signIn} />
            <Button containerStyle={styles.button} title='Register' onPress={() => navigation.navigate('Register')} type='outline' />
            <View style={{ height: 100 }} />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        width: '100%',
        backgroundColor: 'white',
    },
    inputContainer: {
        paddingTop: 20,
        width: 300,
    },
    button: {
        width: 200,
        marginTop: 10,
    }
});

export default LoginScreen;
