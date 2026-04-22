import { storeToRefs } from 'pinia';
import { useInsightStore } from '../store/useInsightStore';

export const useInsights = () => {
  const insightStore = useInsightStore();
  return storeToRefs(insightStore);
};
