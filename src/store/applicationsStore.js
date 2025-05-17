import { defineStore } from 'pinia';
import { setLocalStorage, getLocalStorage } from './utils';
import { useAuthStore } from './authStore';

export const useApplicationsStore = defineStore('applications', {
  state: () => ({
    applicationType: getLocalStorage('application_type') || 'auto',
    draftApplication: getLocalStorage('draft_application') || null,
  }),

  getters: {
    getApplicationType: (state) => {
      const authStore = useAuthStore();
      const user_data = authStore.user_data;
      let type_ = 'change';
      if (user_data.study_status == 'Отчислен') type_ = 'reinstatement';
      else if (user_data.type == 'new') type_ = 'transfer';

      console.log('auto-application-type: ', type_);
      return state.applicationType == 'auto' ? type_ : state.applicationType;
    },
  },
  actions: {
    setType(applicationType) {
      setLocalStorage('application_type', applicationType);
      this.applicationType = applicationType;
    },

    setDraftApplication(applciationData) {
      this.draftApplication = applciationData;
      setLocalStorage('draft_application', this.draftApplication);
    },

    reset: () => {
      localStorage.removeItem('application_type');
      localStorage.removeItem('draft_application');
    },
  },
});
