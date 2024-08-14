import {
    CloudManagerState,
    UpdateAll,
    UpdateLoading,
    UpdateMessage,
    cloudManagerReducer,
} from "../../data/reducers/cloudManager.reducer";
import { assertCloudManagerStateEqual } from "../testUtils";

describe("Data Manager Reducer", () => {
    const state: CloudManagerState = {
        currentUser: "test",
        allUsers: ["test", "test2"],
        isLoading: false,
        message: undefined,
    };

    it("updates message", () => {
        const actualState: CloudManagerState = cloudManagerReducer(
            state,
            new UpdateMessage("test message")
        );
        const expectedState: CloudManagerState = {
            ...state,
            message: "test message",
        };
        assertCloudManagerStateEqual(actualState, expectedState);
    });

    it("updates loading", () => {
        const actualState: CloudManagerState = cloudManagerReducer(
            state,
            new UpdateLoading(true)
        );
        const expectedState: CloudManagerState = {
            ...state,
            isLoading: true,
        };
        assertCloudManagerStateEqual(actualState, expectedState);
    });

    it("updates all", () => {
        const actualState: CloudManagerState = cloudManagerReducer(
            state,
            new UpdateAll(
                "test2",
                ["test3", "test2", "test"],
                true,
                "test message"
            )
        );

        const expectedState: CloudManagerState = {
            currentUser: "test2",
            allUsers: ["test3", "test2", "test"],
            isLoading: true,
            message: "test message",
        };
        assertCloudManagerStateEqual(actualState, expectedState);
    });
});
