import React, {useLayoutEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Icon, Input} from 'react-native-elements';
import {db} from "../firebaseConfig";

const AddChatScreen = ({ navigation }) => {
    const [input, setInput] = useState('');

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Add a new chat',
            headerBackTitle: 'Chats',
        });
    }, [navigation]);

    const createChat = async () => {
        await db.collection('chats')
            .add({
                chatName: input
            })
            .then(() => {
                navigation.goBack();
            })
            .catch(error => alert(error));
    };

    return (
        <View style={styles.container}>
            <Input placeholder='Enter a chat name'
                   value={input}
                   onChangeText={(text) => setInput(text)}
                   onSubmitEditing={createChat}
                   leftIcon={<Icon name='wechat' type='antdesign' size={24} color='black'  />}
            />
            <Button onPress={createChat}
                    disabled={!input}
                    title='Create a new chat'  />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 30,
        height: '100%',
    }
});

export default AddChatScreen;
