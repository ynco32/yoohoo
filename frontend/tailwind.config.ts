module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    maxWidth: {
      layout: '430px', // 레이아웃 최대 너비 추가
    },
    screens: {
      mobile: '430px',
      'mobile-l': '425px',
      tablet: '768px',
      desktop: '1024px',
      'desktop-l': '1440px',
    },
    extend: {
      backgroundImage: {
        web: "url('/images/desktop.png')",
        'ticketing-bg':
          'radial-gradient(300px 300px at 50% 50%, #DBEEFD 0%, #EEF7FE 51.9%, #FFF 100%)',
        'congestion-menu':
          'radial-gradient(81.04% 94.42% at 0% 0%, #DEFFE8 0%, #FFF 100%)',
        'ticket-menu':
          'radial-gradient(50% 100% at 50% 0%, #F8EDFF 0%, #FFF 100%)',
        'sharing-menu':
          'radial-gradient(71.76% 83.6% at 0% 100%, #FAFFD7 0%, #FFF 100%)',
        'sight-menu':
          'radial-gradient(70% 55% at 80% 50%, #E0F5FF 0%, #FFF 93.5%)',
        'sight-main-gra':
          'linear-gradient(180deg, #FFF 33.04%, #DBEEFD 52.81%, #BAE4FD 88.73%)',
        'mypage-gra':
          'var(--BG, linear-gradient(180deg, #BAE4FD 33.04%, #DBEEFD 54.2%, #FFF 88.73%))',
        'gradient-radial':
          'radial-gradient(closest-side, var(--tw-gradient-stops))',
        'success-gradient':
          'radial-gradient(circle at center, #BEE5FF 0%,rgb(208, 226, 255) 15%, #FFFFFF 40%)',
      },
      borderRadius: {
        menu: '12.273px',
        userProfile: '30px',
        card: '15px',
        layout: '20px',
        arena: '26px',
      },
      boxShadow: {
        menu: '3.068px 3.068px 20.455px 0px rgba(106, 160, 205, 0.25)',
        card: '0px 4px 10px 0px rgba(0,0,0,0.25)',
        'card-colored': '0px 0px 10px 0px rgba(34, 129, 198, 0.25)',
        'card-hover': '2px 2px 20px 0px rgba(34, 129, 198, 0.25)',
        'my-page': '2px 2px 8px 0px rgba(106, 160, 205, 0.25)',
        concert: '0px 1px 10px 0px rgba(0, 101, 164, 0.11)',
      },
      minHeight: {
        screen: ['100vh', '100dvh'],
      },
      height: {
        card: '140px',
      },

      fontSize: {
        menu: ['20px', { fontWeight: '700', lineHeight: '25px' }],
        'menu-description': ['12px', { fontWeight: '700', lineHeight: '16px' }],
        profile: ['16px,', { fontWeight: '700', lineHeight: '24px' }],
        body: ['16px', { fontWeight: '400', lineHeight: '24px' }],
        'body-bold': ['16px', { fontWeight: '500', lineHeight: '20px' }],
        'body-black': ['16px', { fontWeight: '600', lineHeight: '20px' }],
        caption1: ['14px', { fontWeight: '400', lineHeight: '20px' }],
        'caption1-bold': ['14px', { fontWeight: '500', lineHeight: '20px' }],
        caption2: ['12px', { fontWeight: '400', lineHeight: '18px' }],
        'caption2-bold': ['12px', { fontWeight: '600', lineHeight: '18px' }],
        caption3: ['11px', { fontWeight: '400', lineHeight: '10px' }],
        'caption3-bold': ['12px', { fontWeight: '600', lineHeight: '18px' }],
        head: ['24px', { fontWeight: '500', lineHeight: '33px' }],
        'head-bold': ['24px', { fontWeight: '700', lineHeight: '33px' }],
        number: ['18px', { fontWeight: '400', lineHeight: '20px' }],
        'number-bold': ['18px', { fontWeight: '500', lineHeight: '20px' }],
        'number-extra-bold': [
          '18px',
          { fontWeight: '600', lineHeight: '20px' },
        ],
        subTitle: ['18px', { fontWeight: '500', lineHeight: '26px' }],
        'subTitle-bold': ['18px', { fontWeight: '600', lineHeight: '26px' }],
        title: ['21px', { fontWeight: '500', lineHeight: '30px' }],
        'title-bold': ['21px', { fontWeight: '600', lineHeight: '30px' }],
        'title-extra-bold': ['21px', { fontWeight: '700', lineHeight: '30px' }],
      },
      fontFamily: {
        pretendard: ['Pretendard', 'sans-serif'],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '40px',
        '3xl': '48px',
      },
      zIndex: {
        header: '100',
        modal: '200',
        overlay: '150',
        dropdown: '50',
        sheet: '40',
        content: '45',
      },
      transitionTimingFunction: {
        'in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
      transitionDuration: {
        normal: '200ms',
        slow: '300ms',
        slower: '500ms',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      colors: {
        primary: {
          900: '#070A17',
          800: '#141A3E',
          700: '#202A64',
          sub2: '#2C3A8B',
          500: '#394BB2',
          main: '#5667C9',
          300: '#7C89D5',
          sub1: '#A2ACE1',
          100: '#C9CEEE',
          50: '#F0F1FA',
          text: '#4c81e5',
        },
        secondary: {
          400: '#99D7FF',
          300: '#C2E9FF',
        },
        background: {
          default: '#FCFCFC',
          alt: '#F7F7F8',
        },
        status: {
          info: '#4C8AF7',
          success: '#6AD08D',
          caution: '#F7C859',
          warning: '#EB674C',
        },
        sight: {
          arenaType: '#ECF7FF',
          badge: '#0077FF',
          bg: '#DFF3FF',
          button: '#4986E8',
          form: '#A7DEFF',
          dark: '#5A80BE',
        },
        star: '#FFCC00',
        gray: {
          900: '#101014',
          800: '#272830',
          700: '#3E3F4C',
          600: '#555768',
          500: '#6C6E84',
          400: '#86889C',
          300: '#A2A4B3',
          200: '#BFC0CB',
          100: '#DBDBE1',
          50: '#F7F7F8',
        },
        text: {
          menu: '#515151',
          description: '#919191',
          nickname: '#444444',
        },
        congestion: {
          customRed: '#E85353',
          customOrange: '#FFA500',
          customYellow: '#FFFF00',
          customGreen: '#00FF00',
        },
      },
    },
  },
  plugins: [],
};
