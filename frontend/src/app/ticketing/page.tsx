import styles from './page.module.scss';
import CardButton from '@/components/common/CardButton/CardButton';

export default function TicketingPage() {
  return (
    <div className={styles.container}>
      <div className={styles.titleWrapper}>
        <span className={styles.title}>연습할 플랫폼을 선택해주세요</span>
      </div>
      <div className={styles.platformWrapper}>
        <div className={styles.menuFlex}>
          <CardButton
            imgSrc='/images/dummy.png'
            imgAlt='M 티켓'
            href='/ticketing/mTicket'
            size={72}
          />
          <CardButton
            imgSrc='/images/seatGrape.png'
            imgAlt='N 티켓'
            href='/'
            size={72}
          />
          <CardButton
            imgSrc='/images/capcha.png'
            imgAlt='C 티켓'
            href='/'
            size={72}
          />
          <CardButton
            imgSrc='/images/capcha.png'
            imgAlt='Y 티켓'
            href='/'
            size={72}
          />
        </div>
        <div className={styles.eventWrapper}>
          <div className={styles.eventCard}>
            <div className={styles.eventImageContainer}>
              <CardButton
                imgSrc='/images/event_banner.png'
                imgAlt='이벤트'
                href='/event/uaena-day'
                size='small'
                className={styles.eventIcon}
              />
            </div>
            <div className={styles.eventInfo}>
              <span className={styles.eventLabel}>
                아이유: 더 워너 UAENA DAY
              </span>
              <div className={styles.eventDetails}>
                <span className={styles.eventDate}>4/26 토요일</span>
                <span className={styles.eventTime}>20:00</span>
              </div>
              <span className={styles.eventStatus}>실전 연습 오픈!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
