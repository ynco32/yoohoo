import { WriteButton } from '@/components/common/WriteButton';
import ArenaList from '@/components/features/sight/ArenaList';
import SightReviewForm from '@/components/features/sight/SightReviewForm';
import { SightReviewFormContainer } from '@/components/features/sight/SightReviewFormContainer';
import FormContainer from '@/components/ui/FormContainer';

export default function ReviewFormPage() {
  return (
    <FormContainer>
      <SightReviewFormContainer />
    </FormContainer>
  );
}
