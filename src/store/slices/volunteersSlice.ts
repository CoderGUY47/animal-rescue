import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Volunteer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: ("transport" | "foster" | "medical" | "rescue" | "feeding")[];
  availability: "weekdays" | "weekends" | "both" | "on-call";
  message?: string;
  rescues: number;
  role: string;
};

type VolunteersState = {
  items: Volunteer[];
};

const DEFAULT_VOLUNTEERS: Volunteer[] = [
  {
    id: "v1",
    name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    phone: "+1 555-0322",
    skills: ["medical", "rescue"],
    availability: "both",
    rescues: 45,
    role: "Senior Volunteer",
  },
  {
    id: "v2",
    name: "Michael Chen",
    email: "m.chen@example.com",
    phone: "+1 555-0344",
    skills: ["transport"],
    availability: "weekends",
    rescues: 38,
    role: "Transport Specialist",
  },
  {
    id: "v3",
    name: "Emma Woods",
    email: "emma.w@example.com",
    phone: "+1 555-0366",
    skills: ["foster", "feeding"],
    availability: "weekdays",
    rescues: 29,
    role: "Foster Parent",
  },
];

const loadVolunteers = (): Volunteer[] => {
  if (typeof window === "undefined") return DEFAULT_VOLUNTEERS;
  try {
    const saved = localStorage.getItem("registered_volunteers");
    return saved ? JSON.parse(saved) : DEFAULT_VOLUNTEERS;
  } catch {
    return DEFAULT_VOLUNTEERS;
  }
};

const initialState: VolunteersState = {
  items: loadVolunteers(),
};

const volunteersSlice = createSlice({
  name: "volunteers",
  initialState,
  reducers: {
    registerVolunteer(state, action: PayloadAction<Omit<Volunteer, "id" | "rescues" | "role">>) {
      const roles = ["Local Responder", "Rescue Helper", "Community Coordinator"];
      const randRole = roles[Math.floor(Math.random() * roles.length)];
      
      state.items.push({
        ...action.payload,
        id: crypto.randomUUID(),
        rescues: 0,
        role: randRole,
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("registered_volunteers", JSON.stringify(state.items));
      }
    },
    incrementVolunteerRescues(state, action: PayloadAction<string>) {
      const vol = state.items.find(v => v.id === action.payload);
      if (vol) {
        vol.rescues += 1;
        if (typeof window !== "undefined") {
          localStorage.setItem("registered_volunteers", JSON.stringify(state.items));
        }
      }
    }
  }
});

export const { registerVolunteer, incrementVolunteerRescues } = volunteersSlice.actions;
export default volunteersSlice.reducer;
