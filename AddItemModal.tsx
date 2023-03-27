import { Button, Modal, Text, View, StyleSheet } from "react-native";

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
    }
});

interface AddItemModalProps {
    isVisible: boolean;
    addItem: () => void;
}

export default function AddItemModal(props: AddItemModalProps): JSX.Element {
    return <Modal
        animationType={"slide"}
        visible={props.isVisible}
        transparent={true}>
        <View style={styles.centeredView}>
            <View style={styles.modal}>
                <Text style={{fontSize: 20}}>Add a New Item</Text>
                <Button title="Add" onPress={props.addItem}></Button>
            </View>
        </View>
    </Modal>
}