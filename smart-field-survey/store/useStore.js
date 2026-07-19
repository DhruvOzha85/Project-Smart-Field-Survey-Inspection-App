import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      // Theme State
      darkMode: false,
      setDarkMode: (value) => set({ darkMode: value }),

      // Notification / Sync Settings
      pushNotifications: true,
      setPushNotifications: (value) => set({ pushNotifications: value }),
      emailNotifications: false,
      setEmailNotifications: (value) => set({ emailNotifications: value }),
      autoSync: true,
      setAutoSync: (value) => set({ autoSync: value }),

      // Active Survey Draft
      surveyDraft: {
        title: '',
        description: '',
        latitude: null,
        longitude: null,
        contactId: null,
        photoUri: null,
      },
      updateSurveyDraft: (updates) => set((state) => ({
        surveyDraft: { ...state.surveyDraft, ...updates }
      })),
      resetSurveyDraft: () => set({
        surveyDraft: {
          title: '',
          description: '',
          latitude: null,
          longitude: null,
          contactId: null,
          photoUri: null,
        }
      }),
    }),
    {
      name: 'smart-survey-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        darkMode: state.darkMode, 
        pushNotifications: state.pushNotifications,
        emailNotifications: state.emailNotifications,
        autoSync: state.autoSync
      }),
    }
  )
);

export default useStore;
