import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FormData {
  contentPreferences: {
    purpose: string;
    scriptDescription: string;
    additionalItems: string;
    inPostText: string;
    template: string;
    postTheme: string;
    tone: string;
    contentType: string;
    targetAudience: string;
    creativeStyle: string;
    personalization: string[];
    uploadedImages: string[];
    PostNotification: string;
  };
  campaignScheduling: {
    startDate: Date | null;
    endDate: Date | null;
    frequency: string;
    deliveryChannels: string[];
    bestTimeToDeliver: string;
    goals: string;
    platforms: string[];
  };
  customerData: {
    demographics: string[];
    behaviorDateRange: { start: Date | null; end: Date | null };
    interests: string[];
    preferredChannels: string[];
  };
  brandGuidelines: {
    logo: File | null;
    colors: string;
    tone: string;
    fonts: string;
    keyMessages: string;
  };
}

export const initialState: FormData = {
  contentPreferences: {
    purpose: '',
    scriptDescription: '',
    additionalItems: '',
    inPostText: '',
    template: '',
    postTheme: '',
    tone: '',
    contentType: '',
    targetAudience: '',
    creativeStyle: '',
    personalization: [],
    uploadedImages: [],  // Use Base64 strings here
    PostNotification: ''
  },
  campaignScheduling: {
    startDate: null,
    endDate: null,
    frequency: '',
    deliveryChannels: [],
    bestTimeToDeliver: '',
    goals: '',
    platforms: []
  },
  customerData: {
    demographics: [],
    behaviorDateRange: { start: null, end: null },
    interests: [],
    preferredChannels: []
  },
  brandGuidelines: {
    logo: null,  // Use Base64 string or null here
    colors: '',
    tone: '',
    fonts: '',
    keyMessages: ''
  },
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    updateFormData(state, action: PayloadAction<Partial<FormData>>) {
      return { ...state, ...action.payload };
    },
    resetFormData(state) {
      return initialState;
    }
  }
});

export const { updateFormData, resetFormData } = formSlice.actions;
export default formSlice.reducer;
