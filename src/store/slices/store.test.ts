import { describe, it, expect } from "vitest";
import reportsReducer, { addReport, updateStatus } from "./reportsSlice";
import volunteersReducer, { registerVolunteer } from "./volunteersSlice";

describe("reportsSlice Reducer", () => {
  it("should add a new report correctly", () => {
    const initialState = { items: [], loading: false, error: null };
    const reportPayload = {
      animalType: "dog",
      severity: "moderate" as const,
      condition: "Stray puppy found with light injuries",
      locationInfo: "Broadway St, NY",
      lat: 40.7128,
      lng: -74.006,
      reporterName: "Alice",
      reporterPhone: "1234567890",
      images: [],
    };
    
    const nextState = reportsReducer(initialState, addReport(reportPayload));
    expect(nextState.items.length).toBe(1);
    expect(nextState.items[0].animalType).toBe("dog");
    expect(nextState.items[0].status).toBe("pending");
  });

  it("should update a report status correctly", () => {
    const initialState = {
      items: [
        {
          id: "test-id",
          animalType: "cat",
          severity: "critical" as const,
          condition: "Cat in distress",
          locationInfo: "5th Ave",
          reporterName: "Bob",
          images: [],
          status: "pending" as const,
          createdAt: new Date().toISOString(),
        }
      ],
      loading: false,
      error: null,
    };

    const nextState = reportsReducer(initialState, updateStatus({ id: "test-id", status: "in-progress" }));
    expect(nextState.items[0].status).toBe("in-progress");
  });
});

describe("volunteersSlice Reducer", () => {
  it("should register a volunteer correctly", () => {
    const initialState = { items: [] };
    const volunteerPayload = {
      name: "Jack Smith",
      email: "jack@example.com",
      phone: "123456789",
      skills: ["transport" as const, "medical" as const],
      availability: "weekends" as const,
      message: "Ready to assist",
    };

    const nextState = volunteersReducer(initialState, registerVolunteer(volunteerPayload));
    expect(nextState.items.length).toBe(1);
    expect(nextState.items[0].name).toBe("Jack Smith");
    expect(nextState.items[0].rescues).toBe(0);
  });
});
