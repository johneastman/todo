import { useContext, useEffect, useReducer } from "react";
import { COPY, List, MOVE } from "../data/data";
import CustomModal from "./core/CustomModal";
import CustomRadioButtons from "./core/CustomRadioButtons";
import { ModalButton, MoveItemAction, SelectionValue } from "../types";
import CustomDropdown from "./core/CustomDropdown";
import { MoveItems } from "../data/reducers/lists.reducer";
import { ListsContext } from "../contexts/lists.context";
import {
    MoveItemsModalState,
    UpdateDestination,
    UpdateAction,
    moveItemsModalReducer,
} from "../data/reducers/moveItemsModal.reducer";
import { UpdateError, Replace } from "../data/reducers/common";

function getState(): MoveItemsModalState {
    return {
        action: "Copy",
    };
}

type MoveItemsModalProps = {
    currentListIndex: number;
    isVisible: boolean;
    setIsVisible: (isVisible: boolean) => void;
};

export default function MoveItemsModal(
    props: MoveItemsModalProps
): JSX.Element {
    const { currentListIndex, isVisible, setIsVisible } = props;

    const listsContextData = useContext(ListsContext);
    const {
        data: { lists },
        listsDispatch: dispatch,
    } = listsContextData;

    const [moveItemsModalState, moveItemsModalDispatch] = useReducer(
        moveItemsModalReducer,
        getState()
    );
    const { action, destinationListIndex, error } = moveItemsModalState;

    const setError = (newError: string) =>
        moveItemsModalDispatch(new UpdateError(newError));

    const setDestination = (newDestination: number) =>
        moveItemsModalDispatch(new UpdateDestination(newDestination));

    const setAction = (newAction: MoveItemAction) =>
        moveItemsModalDispatch(new UpdateAction(newAction));

    useEffect(() => {
        const newState: MoveItemsModalState = getState();
        moveItemsModalDispatch(new Replace(newState));
    }, [props]);

    const positiveAction = () => {
        if (destinationListIndex === undefined) {
            setError("A destination list must be selected");
            return;
        }

        dispatch(new MoveItems(action, currentListIndex, destinationListIndex));

        // Dismiss the modal
        setIsVisible(false);
    };

    const negativeAction = () => setIsVisible(false);

    /**
     * To preverse lists' indices, create a {@link List}-{@link number} tuple, then filter
     * those tuples based on the desired criteria, then convert those tuples
     * to {@link SelectionValue} objects.
     *
     * For the destination lists, we want every list except the current list.
     */
    const labeledDestinationLists: SelectionValue<number>[] = lists
        .map((list, index): [List, number] => [list, index])
        .filter(([_, index]) => index !== currentListIndex)
        .map(([list, index]) => ({ label: list.name, value: index }));

    const positiveActionButton: ModalButton = {
        text: action,
        onPress: positiveAction,
    };

    const negativeActionButton: ModalButton = {
        text: "Cancel",
        onPress: negativeAction,
    };

    return (
        <CustomModal
            title={`${action} Items`}
            isVisible={isVisible}
            positiveAction={positiveActionButton}
            negativeAction={negativeActionButton}
            error={error}
        >
            <CustomRadioButtons
                data={[COPY, MOVE]}
                setSelectedValue={setAction}
                selectedValue={action}
            />

            <CustomDropdown
                placeholder="Select destination list"
                data={labeledDestinationLists}
                setSelectedValue={setDestination}
                selectedValue={destinationListIndex}
            />
        </CustomModal>
    );
}
