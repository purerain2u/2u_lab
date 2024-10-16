import React from 'react';
import Image from 'next/image';
import styles from './AboutPage.module.css';

const AboutPage = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Image 
          src="/logo.png"
          alt="이유 사회적협동조합 로고"
          width={200}
          height={100}
          className={styles.logo}
        />
        <h1 className={styles.title}>이유 사회적협동조합</h1>
        <p className={styles.subtitle}>교통약자의 이동의 자유를 실현하다</p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Social Mission</h2>
        <p>
          이유 사회적협동조합은 교통약자의 이동 불편을 지속적으로 연구하며, 모든 사람의 자유로운 이동이 가능한 세상을 만들어갑니다.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Main Services</h2>
        <div className={styles.serviceGrid}>
          <ServiceCard 
            title="교통약자 이동배차 시스템" 
            description="모든 교통약자가 언제 어디서든 이용 가능한 맞춤형 이동 배차 시스템"
            imageSrc="/dispatch-system.png"
          />
          <ServiceCard 
            title="포용관광" 
            description="장애인 당사자가 직접 관광상품을 기획하고 판매하는 가치있는 포용관광"
            imageSrc="/inclusive-tourism.png"
          />
          <ServiceCard 
            title="이동의 자유지도" 
            description="장애인 당사자를 위한 배리어프리 길안내 및 시설물 안내 서비스"
            imageSrc="/freedom-map.png"
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Key Achievements</h2>
        <div className={styles.statsGrid}>
          <StatCard number="181" description="운행차량" />
          <StatCard number="25,456" description="자유 서비스 이용자" />
          <StatCard number="47" description="일자리 창출" />
          <StatCard number="122,239" description="온실배출 감소량(kg-CO2)" />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Company History</h2>
        <div className={styles.historyContainer}>
          <div className={styles.historyImageContainer}>
            <Image 
              src="/이유team.png"
              alt="이유 팀"
              width={600}
              height={400}
              className={styles.historyImage}
            />
          </div>
          <div className={styles.historyContent}>
            <Timeline />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Partners</h2>
        <Image 
          src="/partners.png"
          alt="협력기관"
          width={800}
          height={400}
          className={styles.partnerImage}
        />
      </section>

      <footer className={styles.footer}>
        <p>사업자등록번호: 166-82-00247</p>
        <p>전화: +82-70-8672-5845</p>
        <p>주소: 부산광역시 해운대구 센텀중앙로 48 1811,1812호(우동, 에이스하이테크21)</p>
        <p>이메일: biz@2u.or.kr</p>
      </footer>
    </div>
  );
};

interface ServiceCardProps {
  title: string;
  description: string;
  imageSrc: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, imageSrc }) => (
  <div className={styles.serviceCard}>
    <Image 
      src={imageSrc}
      alt={title}
      width={300}
      height={200}
      className={styles.serviceImage}
    />
    <div className={styles.serviceContent}>
      <h3 className={styles.serviceTitle}>{title}</h3>
      <p className={styles.serviceDescription}>{description}</p>
    </div>
  </div>
);

interface StatCardProps {
  number: string;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({ number, description }) => (
  <div className={styles.statCard}>
    <p className={styles.statNumber}>{number}</p>
    <p className={styles.statDescription}>{description}</p>
  </div>
);

interface TimelineYearProps {
  year: string;
  events: string[];
}

const TimelineYear: React.FC<TimelineYearProps> = ({ year, events }) => (
  <div className={styles.timelineYear}>
    <h3 className={styles.year}>{year}</h3>
    <ul className={styles.events}>
      {events.map((event, index) => (
        <li key={index} className={styles.event}>
          <span className={styles.bullet}>•</span>
          {event}
        </li>
      ))}
    </ul>
  </div>
);

const Timeline = () => (
  <div className={styles.timeline}>
    <TimelineYear year="2023" events={[
      "08~12 5060 시니어 일자리를 위한 ChatGPT 기반 마케팅 역량 교육",
      "07.01 부산광역시 사회적경제 지원",
    ]} />
    <TimelineYear year="2022" events={[
      "02~12 스마트헬스케어(마음봄치료) 실증 시범사업",
      "01~02 같이,가치 포용관광 서비스 프로젝트 진행",
    ]} />
    <TimelineYear year="2021" events={[
      "12.23 BF_DRT 서비스 실증 진행",
      "2020~2021 스마트시티 챌린지 본사업자 선정",
      "01~03 부산 시도 무장애 관광해설사 양성(최초)",
    ]} />
    <TimelineYear year="2020" events={[
      "2020~2021 보건복지부 통합돌봄 선도사업'이동지원'",
      "08.27 부산시 장애인 생활이동지원센터 위탁계약",
    ]} />
  </div>
);

export default AboutPage;
