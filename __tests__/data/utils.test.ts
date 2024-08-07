import {
    CloudData,
    cloudDelete,
    cloudGet,
    CloudMessage,
    cloudSave,
    DataResponse,
    MessageResponse,
} from "../../data/utils";

jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

describe("Data Utils", () => {
    describe("Cloud API", () => {
        const url: string = "https://example.com";

        const mockData: DataResponse = {
            listsJSON: [
                {
                    name: "Test List",
                    items: [
                        {
                            name: "Test Item",
                            notes: "Test Notes",
                            quantity: 1,
                            isComplete: false,
                            isSelected: false,
                            isLocked: false,
                        },
                    ],
                    listType: "List",
                    isSelected: false,
                    isLocked: false,
                    defaultNewItemPosition: "top",
                },
            ],
            settingsJSON: {
                isDeveloperModeEnabled: false,
                defaultListType: "List",
                defaultListPosition: "top",
            },
        };

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("Deletes Data", async () => {
            mockFetchMessage({
                message: "Data successfully deleted",
            });

            const responseData = await cloudDelete(url);
            expect(responseData.type).toEqual("message");
            expect(responseData.message).toEqual("Data successfully deleted");
        });

        it("Saves Data", async () => {
            mockFetchMessage({
                message: "Data saved successfully",
            });
            const responseData = await cloudSave(url, mockData);
            expect(responseData.type).toEqual("message");
            expect(responseData.message).toEqual("Data saved successfully");
        });

        describe("Gets Data", () => {
            it("Returns a message", async () => {
                mockFetchMessage({
                    message: "Data successfully retrieved",
                });
                const responseData = await cloudGet(url);
                expect(responseData.type).toEqual("message");
                expect((responseData as CloudMessage).message).toEqual(
                    "Data successfully retrieved"
                );
            });

            it("Returns data", async () => {
                mockFetchData(mockData);
                const responseData = await cloudGet(url);
                expect(responseData.type).toEqual("data");

                const { data } = responseData as CloudData;
                expect(data).toEqual(mockData);
            });
        });
    });
});

function mockFetchMessage(message: MessageResponse) {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve(message),
        })
    ) as jest.Mock;
}

function mockFetchData(data: DataResponse) {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve(data),
            status: 200,
        })
    ) as jest.Mock;
}
