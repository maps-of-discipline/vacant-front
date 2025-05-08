import { defineStore } from 'pinia';
import { setLocalStorage, getLocalStorage } from './utils';

export const useApplicationsStore = defineStore('applications', {
  state: () => ({
    applicationType: getLocalStorage('application_type') || 'change',
    draftApplication: getLocalStorage('draft_application') || null,
  }),

  actions: {
    setType(applicationType) {
      setLocalStorage('application_type', applicationType);
      this.applicationType = applicationType;
    },

    setDraftApplication(applciationData) {
      this.draftApplication = applciationData;
      setLocalStorage('draft_application', this.draftApplication);
    },
  },
});
