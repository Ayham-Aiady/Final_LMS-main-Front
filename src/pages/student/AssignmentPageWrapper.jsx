import { useParams } from 'react-router-dom';
import AssignmentView from './AssignmentView.jsx';
import { useAuth } from '../../context/authContext.jsx';

const AssignmentPageWrapper = () => {
  const { assignmentId } = useParams();
  const { user } = useAuth();

  return (
    <AssignmentView
      assignmentId={parseInt(assignmentId)}
      userId={user?.id}
    />
  );
};

export default AssignmentPageWrapper;
