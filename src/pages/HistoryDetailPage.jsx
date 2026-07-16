import { useParams, Navigate } from 'react-router-dom';
import { useEstimation } from '../context/EstimationContext';
import HistoryDetail from '../components/history/HistoryDetail';

export default function HistoryDetailPage() {
  const { id } = useParams();
  const { history } = useEstimation();

  const estimation = history.find(e => e.id === id);

  if (!estimation) {
    return <Navigate to="/history" replace />;
  }

  return <HistoryDetail estimation={estimation} />;
}
