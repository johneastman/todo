import {
    DataManagerState,
    UpdateAll,
    UpdateLoading,
    UpdateMessage,
    dataManagerReducer,
} from "../../data/reducers/dataManager.reducer";
import { assertDataManagerStateEqual } from "../testUtils";

describe("Data Manager Reducer", () => {
    const state: DataManagerState = {
        isLoading: false,
        message: undefined,
    };

    it("updates message", () => {
        const actualState: DataManagerState = dataManagerReducer(
            state,
            new UpdateMessage("test message")
        );
        const expectedState: DataManagerState = {
            isLoading: false,
            message: "test message",
        };
        assertDataManagerStateEqual(actualState, expectedState);
    });

    it("updates loading", () => {
        const actualState: DataManagerState = dataManagerReducer(
            state,
            new UpdateLoading(true)
        );
        const expectedState: DataManagerState = {
            isLoading: true,
            message: undefined,
        };
        assertDataManagerStateEqual(actualState, expectedState);
    });

    it("updates all", () => {
        const actualState: DataManagerState = dataManagerReducer(
            state,
            new UpdateAll(true, "test message")
        );
        const expectedState: DataManagerState = {
            isLoading: true,
            message: "test message",
        };
        assertDataManagerStateEqual(actualState, expectedState);
    });
});
