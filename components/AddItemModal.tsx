import { useState } from "react";
import { Button, Modal, Text, View, TextInput, StyleSheet } from "react-native";
import { Item } from "./ItemList";

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal: {
        width: "90%",
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        justifyContent: "center",
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: "100%"
    },
    space: {
        width: 10, // or whatever size you need
        height: 20,
    },
});

interface ItemModalProps {
    item: Item | null;
    index: number;
    isVisible: boolean;
    title: string;

    positiveActionText: string;
    positiveAction: (index: number, item: Item) => void;

    negativeActionText: string;
    negativeAction: () => void;
}

export default function ItemModal(props: ItemModalProps): JSX.Element {
    
    const [text, onChangeText] = useState<string>("");

    return <Modal
        animationType={"slide"}
        visible={props.isVisible}
        transparent={true}>
        <View style={styles.centeredView}>
            <View style={styles.modal}>
                <Text style={{fontSize: 20}}>{ props.title }</Text>
                <TextInput
                    defaultValue={props.item?.value || ""}
                    style={styles.input}
                    onChangeText={onChangeText}
                    placeholder="Enter the name of your item">
                </TextInput>
                <View style={{flexDirection: "row"}}>
                    <Button 
                        title={props.positiveActionText}
                        onPress={() => {
                            let item: Item = new Item(text);
                            props.positiveAction(props.index, item);
                        }}/>
                    <View style={styles.space}/>
                    <Button title={props.negativeActionText} onPress={props.negativeAction}/>
                </View>
            </View>
        </View>
    </Modal>
}