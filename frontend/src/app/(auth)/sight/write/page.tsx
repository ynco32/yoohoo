import { WriteButton } from '@/components/common/WriteButton';
import ArenaList from '@/components/features/sight/arena/ArenaList';
import SightReviewForm from '@/components/features/sight/SightReviewForm';
import { SightReviewFormContainer } from '@/components/features/sight/form/SightReviewFormContainer';
import FormContainer from '@/components/ui/FormContainer';

export default function ReviewFormPage() {
  return (
    <FormContainer>
      <SightReviewFormContainer />
    </FormContainer>
  );
}
