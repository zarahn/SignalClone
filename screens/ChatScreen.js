import React, {useLayoutEffect, useState} from 'react';
import {
    Keyboard,
    KeyboardAvoidingView, Platform,
    SafeAreaView, ScrollView,
    StyleSheet,
    Text, TextInput,
    TouchableOpacity, TouchableWithoutFeedback,
    View
} from 'react-native';
import {Avatar} from 'react-native-elements';
import {AntDesign, FontAwesome, Ionicons} from '@expo/vector-icons';
import {StatusBar} from "expo-status-bar";
import {auth, db} from "../firebaseConfig";
import firebase from "firebase";

const ChatScreen = ({ navigation, route }) => {

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useLayoutEffect(() => {
        navigation.setOptions({
            title: route.params.chatName,
            headerBackTitleVisibles: false,
            headerTitleAlign: 'left',
            headerTitle: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <Avatar rounded source={{ uri: messages[0]?.data.photoURL}} />
                    <Text style={styles.chatName}>{route.params.chatName}</Text>
                </View>
            ),
            headerLeft: () => (
                <TouchableOpacity
                    style={styles.headerLeft}
                    onPress={() => navigation.goBack()}>
                    <AntDesign name='arrowleft' size={24} color='white' />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <View style={styles.headerRight}>
                    <TouchableOpacity>
                        <FontAwesome name='video-camera' size={24} color='white' />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name='call' size={24} color='white' />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation, messages]);

    useLayoutEffect(() => {
        const subscription = db.collection('chats')
            .doc(route.params.id).collection('messages').orderBy('timestamp','asc')
            .onSnapshot(snapshot => {
                setMessages(snapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data(),
                })))
            });
        return subscription;
    }, [route]);

    const sendMessage = () => {
        Keyboard.dismiss();
        db.collection('chats').doc(route.params.id).collection('messages')
            .add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                message: input,
                displayName: auth.currentUser.displayName,
                email: auth.currentUser.email,
                photoURL: auth.currentUser.photoURL,
            });
        setInput('');
    };

    return (
        <SafeAreaView style={styles.fullAreaView}>
            <StatusBar style='light' />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
                keyboardVerticalOffset={90}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <>
                        <ScrollView contentContainerStyle={{ paddingTop: 15 }}>
                            {/* chats   */}
                            {messages.map(({id, data}) => (
                                (data.email === auth.currentUser.email) ? (
                                    <View key={id} style={styles.receiver}>
                                        <Avatar rounded size={30}
                                            // WEB
                                                containerStyle={{ position: 'absolute', bottom: -15, right: -5 }}
                                            // APP
                                                position='absolute' bottom={-15} right={-5}
                                                source={{ uri: data.photoURL }} />
                                        <Text style={styles.receiverText}>{data.message}</Text>
                                    </View>
                                ) : (
                                    <View key={id} style={styles.sender}>
                                        <Avatar rounded size={30}
                                            // WEB
                                                containerStyle={{ position: 'absolute', bottom: -15, left: -5 }}
                                            // APP
                                                position='absolute' bottom={-15} left={-5}
                                                source={{ uri: data.photoURL }} />
                                        <Text style={styles.senderText}>{data.message}</Text>
                                        <Text style={styles.senderName}>{data.displayName}</Text>
                                    </View>
                                )
                            ))}
                        </ScrollView>
                        <View style={styles.footer}>
                            <TextInput
                                style={styles.textInput}
                                placeholder='Please input here'
                                value={input}
                                onChangeText={(text) => setInput(text)}
                                onSubmitEditing={sendMessage}
                            />
                            <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
                                <Ionicons name='send' size={24} color='#2B68E6' />
                            </TouchableOpacity>
                        </View>
                    </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chatName: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 10,
    },
    headerLeft: {
        marginLeft: 10,
    },
    headerRight: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 80,
        marginRight: 20,
    },
    fullAreaView: {
        flex: 1,
        backgroundColor: '#FAFAFA'
    },
    container: {
        flex: 1,
    },
    textInput: {
        bottom: 0,
        height: 40,
        flex: 1,
        marginRight: 15,
        backgroundColor: '#ECECEC',
        borderRadius: 30,
        padding: 10,
        color: 'grey',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: 15,
    },
    receiver: {
        padding: 15,
        backgroundColor: '#ECECEC',
        alignSelf: 'flex-end',
        borderRadius: 20,
        marginRight: 15,
        marginBottom: 20,
        maxWidth: '80%',
        position: 'relative',
    },
    receiverText: {
        color: 'black',
        fontWeight: '500',
        marginLeft: 10,
    },
    sender: {
        padding: 15,
        backgroundColor: '#2B68E6',
        alignSelf: 'flex-start',
        borderRadius: 20,
        marginLeft: 15,
        marginBottom: 20,
        maxWidth: '80%',
        position: 'relative',
    },
    senderName: {
        left: 10,
        paddingRight: 10,
        fontSize: 10,
        color: 'white',
    },
    senderText: {
        color: 'white',
        fontWeight: '500',
        marginLeft: 10,
        marginBottom: 15,
    },
});

export default ChatScreen;
