import { cn } from '@/lib/utils';
import type { IconName, PaymentMethod } from '@/openapi-codegen/clochetteSchemas';

interface IconProps {
  className: string;
}

const BeerIcon = (props: IconProps): React.JSX.Element => {
  return (
    <svg
      className={props.className}
      viewBox='0 0 512 512'
      aria-label='icon'
      data-testid='Beer'
    >
      <path
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='16'
        d='M352 200v240a40.12 40.12 0 0 1-40 40H136a40.12 40.12 0 0 1-40-40V224'
      ></path>
      <path
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeMiterlimit='10'
        strokeWidth='16'
        d='M352 224h40a56.16 56.16 0 0 1 56 56v80a56.16 56.16 0 0 1-56 56h-40'
      ></path>
      <path
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='16'
        d='M224 256v160m64-160v160M160 256v160m160-304a48 48 0 0 1 0 96c-13.25 0-29.31-7.31-38-16H160c-8 22-27 32-48 32a48 48 0 0 1 0-96a47.91 47.91 0 0 1 26 9'
      ></path>
      <path
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeMiterlimit='10'
        strokeWidth='16'
        d='M91.86 132.43a40 40 0 1 1 60.46-52S160 91 160 96m-14.17-31.29C163.22 44.89 187.57 32 216 32c52.38 0 94 42.84 94 95.21a95 95 0 0 1-1.67 17.79'
      ></path>
    </svg>
  );
};

const GlassIcon = (props: IconProps): React.JSX.Element => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 384 512'
      className={props.className}
      fill='currentColor'
      strokeWidth={0}
      stroke='currenColor'
      aria-label='icon'
      data-testid='Glass'
    >
      <path d='M344.4 40.86C339.1 35.17 331.7 32 323.1 32H60.04C52.27 32 44.95 35.17 39.59 40.86c-5.25 5.578-7.982 13.12-7.545 20.89l27.99 392C61.02 468.5 73.27 480 88.03 480h207.9c14.76 0 27.01-11.48 27.99-26.25l27.99-392C352.4 53.98 349.7 46.44 344.4 40.86zM307.1 452.7C307.6 459 302.3 464 295.1 464H88.03c-6.322 0-11.61-4.969-12.03-11.39L48.02 60.85C47.83 57.49 49 54.2 51.23 51.83C53.56 49.36 56.69 48 60.04 48h263.9c3.348 0 6.475 1.359 8.797 3.824c2.236 2.379 3.41 5.668 3.236 8.785L307.1 452.7z' />
    </svg>
  );
};

const FoodIcon = (props: IconProps): React.JSX.Element => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 640 512'
      className={props.className}
      fill='currentColor'
      strokeWidth={0}
      stroke='currenColor'
      aria-label='icon'
      data-testid='Food'
    >
      <path d='M263 62.99c1.938-3.625 3.734-4.156 4.359-4.344l34.27-10.25c2.734-.8437 5.531-.2187 7.656 1.719c2.078 1.844 3.016 4.531 2.531 7.187L289.5 178.5C288.2 185.5 295.1 190.5 301.9 186.6c.0664-.0449-.0664 .0449 0 0C303.7 185.4 305 183.4 305.4 181.3l22.18-121.1c1.5-8.25-1.391-16.5-7.625-21.97C313.8 32.52 305.2 30.61 297.1 33.08L262.9 43.3C257 45.05 252.3 49.11 248.9 55.49C246.8 59.36 248.3 64.21 252.2 66.3C256.1 68.33 260.1 66.92 263 62.99zM93.25 239.3C94 243.1 97.35 245.8 101.1 245.8c.5156 0 1.031-.0625 1.547-.1562c4.344-.8438 7.172-5.031 6.328-9.375L72.1 47.14C71.53 44.14 72.74 41.08 75.19 39.24l28.56-21.66c2.078-1.625 5.016-2.031 7.641-.1C114 17.58 115.9 19.8 116.4 22.58l3.75 19.1c.8125 4.375 5.062 7.125 9.328 6.406c4.344-.8125 7.203-4.1 6.391-9.344L132.1 19.67C130.6 11.39 124.1 4.643 117.1 1.674c-7.781-3.094-16.67-1.812-23.11 3.187L65.58 26.46c-7.266 5.406-10.89 14.69-9.203 23.69L93.25 239.3zM238.7 501.3c-1.215-3.117-4.136-5.339-7.481-5.339H85.74c-7.514 0-14.02-5.219-15.65-12.55L15.98 239.1l34.02 .125C61.48 286.5 120.8 319.1 192 319.1c11.67 0 22.87-1.137 33.7-2.916c3.678-.6055 6.378-3.9 6.479-7.627c.002-.0762-.002 .0762 0 0C232.3 304.6 228 300.6 223.2 301.4C213.2 303 202.8 303.1 192 303.1c-64.63 0-118.1-29.1-126.8-69c-1.5-6.75-8.25-10.1-15.25-10.1L15.1 223.1c-4.875 0-9.522 2.281-12.52 6.031c-3.002 3.75-4.104 8.716-3.104 13.47l54.13 243.5C57.75 501.6 70.76 512 85.73 512h145.6C236.8 512 240.7 506.4 238.7 501.3C238.7 501.3 238.7 501.4 238.7 501.3zM16.15 193.6c.75 3.812 4.094 6.437 7.828 6.437c.5313 0 1.047-.0625 1.578-.1562C29.88 199 32.7 194.8 31.84 190.5l-15.58-78.4c-1-5.437 .9062-10.97 5.062-14.72c3.703-3.312 8.938-4.469 14.11-3.25C39.73 95.14 44.05 92.46 45.05 88.14c1.016-4.312-1.641-8.625-5.938-9.625C28.68 75.99 18.34 78.55 10.62 85.42C2.289 92.99-1.492 103.1 .5391 115L16.15 193.6zM159.1 276.8c4.422 0 8-3.594 8-7.1V23.99c0-2.781 1.438-5.375 3.844-6.844C174.1 15.74 177.1 15.61 179.5 16.89l32.13 16.06c2.625 1.25 4.328 3.1 4.328 7.031v228.8c0 4.406 3.578 7.1 8 7.1s8-3.594 8-7.1V39.99c0-9.156-5.266-17.56-13.3-21.41L186.8 2.612C179.4-1.169 170.4-.8257 163.5 3.518C156.4 7.799 151.1 15.64 151.1 23.99v244.8C151.1 273.2 155.6 276.8 159.1 276.8zM349.6 96.86c3.609-.5625 8.844-.5 13.06 3.344c4.141 3.656 6.031 9.062 5.078 14.34l-6.469 31.42c-1.203 5.852 4.242 10.85 9.969 9.144c2.805-.8301 5.127-3.141 5.717-6.004l6.486-31.5c2-11.06-1.812-22.03-10.09-29.31c-6.859-6.312-16.25-8.812-26.31-7.25c-4.359 .7187-7.328 4.844-6.609 9.187C341.2 94.61 345.4 97.42 349.6 96.86zM364 287.1c6.656 0 12-5.344 12-11.1s-5.344-11.1-12-11.1S352 269.3 352 275.1S357.3 287.1 364 287.1zM616 342.7V303.1c0-21.87-9.406-42.84-27.22-60.61c-30.81-30.77-87.22-51.39-140.4-51.39c-.2187-.0313-.4687-.0156-.7187 0c-53.22 0-109.6 20.62-140.4 51.39C289.4 261.2 280 282.1 280 303.1v38.66C265.7 350.1 256 366.3 256 383.1s9.711 33.02 24 41.34v42.66c0 24.27 19.75 44 44 44H572c24.25 0 44-19.74 44-44v-42.66c14.29-8.316 24-23.62 24-41.34C640 366.3 630.3 350.1 616 342.7zM296 303.1c0-17.78 7.562-34.37 22.53-49.28c28-27.97 79.86-46.71 129.2-46.71c.2187 .0313 .4844 .0156 .6406 0c49.28 0 101.1 18.74 129.1 46.71C592.4 269.6 600 286.2 600 303.1v32.81c-2.617-.4414-5.258-.8066-8-.8066h-288c-2.742 0-5.383 .3652-8 .8066V303.1zM600 467.1c0 15.44-12.56 27.1-28 27.1h-248c-15.44 0-28-12.56-28-27.1v-36.81c2.617 .4414 5.258 .8066 8 .8066h288c2.742 0 5.383-.3652 8-.8066V467.1zM592 415.1h-288c-17.64 0-32-14.36-32-31.1c0-17.64 14.36-31.1 32-31.1h288c17.64 0 32 14.36 32 31.1C624 401.6 609.6 415.1 592 415.1zM448 267.1c6.656 0 12-5.344 12-11.1c0-6.656-5.344-11.1-12-11.1s-12 5.344-12 11.1C436 262.7 441.3 267.1 448 267.1zM532 287.1c6.656 0 12-5.344 12-11.1s-5.344-11.1-12-11.1S520 269.3 520 275.1S525.3 287.1 532 287.1z' />
    </svg>
  );
};

const SoftIcon = (props: IconProps): React.JSX.Element => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 32 32'
      className={props.className}
      stroke='currentColor'
      aria-label='icon'
      data-testid='Soft'
    >
      <g transform='translate(0 -1020.362)'>
        <path
          fill='none'
          d='m 7.8032694,1028.2626 c 0.6449922,-0.9746 1.4694353,-1.8389 1.6963635,-2.9005 l 0,-0.5 12.0000001,0 0,0.5 c 0.112373,1.1398 1.066197,1.9412 1.701203,2.9005 0.242857,0.367 0.299188,0.8274 0.299188,1.2674 l 1e-6,16.9367 c 10e-6,1.1896 -0.56008,2.3098 -1.511778,3.0236 l -2e-5,0 c -0.42537,0.2737 -0.928051,0.4021 -1.432586,0.3659 l -10.107173,0 c -0.6133404,0 -1.2101335,-0.1988 -1.7007948,-0.567 l -2.01e-5,0 c -0.8356123,-0.6926 -1.2963345,-1.7383 -1.2435677,-2.8224 l -1.5e-6,-16.9367 c -0.015345,-0.4742 0.088154,-0.9486 0.2991836,-1.2675 z'
        />
        <path
          fill='none'
          d='m -717.91611,744.83954 a 5.0031424,5.0031424 0 0 1 -5.00314,5.00314 5.0031424,5.0031424 0 0 1 -5.00314,-5.00314 5.0031424,5.0031424 0 0 1 5.00314,-5.00314 5.0031424,5.0031424 0 0 1 5.00314,5.00314 z'
          transform='rotate(-45)'
        />
        <path
          fill='none'
          d='M10.900891 1039.6311c0 0 1.799831-.4708 2.47642-1.0614 1.035989-.9044 1.113638-2.6033 2.122662-3.5377.773889-.7167 2.830196-1.4151 2.830196-1.4151M12.736529 1042.0432c0 0 1.799831-.4707 2.47642-1.0613 1.03599-.9044 1.113639-2.6033 2.122663-3.5377.773888-.7167 2.830196-1.4151 2.830196-1.4151'
        />
        <path
          fill='none'
          d='M18.504683 1024.8571l1.989875-1.9899M9.006959 1024.8621l12.986111 0M9.4999602 1045.8622l0 .5c0 .8326.6749478 1.5075 1.5075398 1.5075l.492473-.01M11.497629 1026.369l-.216944.6517a3.7675659 3.7690244 0 01-.910148 1.4733l-.000038 0a3.3668166 3.3681199 0 00-.8663058 2.4278l0 .4333'
        />
      </g>
    </svg>
  );
};

const BarrelIcon = (props: IconProps): React.JSX.Element => {
  return (
    <svg
      className={props.className}
      viewBox='0 0 24 24'
      aria-label='icon'
      data-testid='Barrel'
    >
      <g
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='0.5'
      >
        <path d='M7.278 4h9.444a2 2 0 0 1 1.841 1.22C19.521 7.48 20 9.74 20 12c0 2.26-.479 4.52-1.437 6.78A2 2 0 0 1 16.722 20H7.278a2 2 0 0 1-1.841-1.22C4.479 16.52 4 14.26 4 12c0-2.26.479-4.52 1.437-6.78A2 2 0 0 1 7.278 4z'></path>
        <path d='M14 4c.667 2.667 1 5.333 1 8s-.333 5.333-1 8M10 4c-.667 2.667-1 5.333-1 8s.333 5.333 1 8m-5.5-4h15m0-8h-15'></path>
      </g>
    </svg>
  );
};

const MiscIcon = (props: IconProps): React.JSX.Element => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1}
      stroke='currentColor'
      className={props.className}
      data-testid='Misc'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9'
      />
    </svg>
  );
};

const LydiaIcon = (props: IconProps): React.JSX.Element => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className={props.className}
      preserveAspectRatio='xMidYMid meet'
      viewBox='0 0 24 24'
      aria-label='icon'
      data-testid='Lydia'
    >
      <path
        fill='#1472b1'
        d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12s12-5.373 12-12S18.627 0 12 0zm5.895 17.611a.421.421 0 0 1-.168.035h-1.155a.608.608 0 0 1-.56-.377l-4-9.613l-3.991 9.607a.61.61 0 0 1-.56.377H6.273a.42.42 0 0 1-.385-.59L10.91 5.575a.793.793 0 0 1 .726-.475h.748a.792.792 0 0 1 .726.48l5.003 11.482a.42.42 0 0 1-.218.549z'
      />
    </svg>
  );
};

const CashIcon = (props: IconProps): React.JSX.Element => {
  return (
    <svg
      className={props.className}
      viewBox='0 0 24 24'
      aria-label='icon'
      data-testid='Cash'
    >
      <path
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1'
        d='M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0a3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z'
      />
    </svg>
  );
};

const CBIcon = (props: IconProps): React.JSX.Element => {
  return (
    <svg
      className={props.className}
      viewBox='0 0 24 24'
      aria-label='icon'
      data-testid='CB'
    >
      <path
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1'
        d='M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z'
      />
    </svg>
  );
};

const VirementIcon = (props: IconProps): React.JSX.Element => {
  return (
    <svg
      className={props.className}
      viewBox='0 0 24 24'
    >
      <path
        fill='currentColor'
        d='M15 14v-3h3V9l4 3.5l-4 3.5v-2h-3m-1-6.3V9H2V7.7L8 4l6 3.7M7 10h2v5H7v-5m-4 0h2v5H3v-5m10 0v2.5l-2 1.8V10h2m-3.9 6l-.6.5l1.7 1.5H2v-2h7.1m7.9-1v3h-3v2l-4-3.5l4-3.5v2h3Z'
      ></path>
    </svg>
  );
};

const SettingsIcon = (props: IconProps): React.JSX.Element => {
  return (
    <svg
      className={props.className}
      viewBox='0 0 16 16'
      data-testid='Setting'
    >
      <g fill='currentColor'>
        <path d='M8 4.754a3.246 3.246 0 1 0 0 6.492a3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0a2.246 2.246 0 0 1-4.492 0z'></path>
        <path d='M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z'></path>
      </g>
    </svg>
  );
};

export const IncreaseArrowIcon = (): React.JSX.Element => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='text-green-600 h-4 w-4'
    >
      <polyline points='23 6 13.5 15.5 8.5 10.5 1 18'></polyline>
      <polyline points='17 6 23 6 23 12'></polyline>
    </svg>
  );
};

export const DecreasingArrowIcon = (): React.JSX.Element => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='text-red-600 h-4 w-4'
    >
      <polyline points='23 18 13.5 8.5 8.5 13.5 1 6'></polyline>
      <polyline points='17 18 23 18 23 12'></polyline>
    </svg>
  );
};

export const PlusCircledIcon = ({ className }: { className?: string }): React.JSX.Element => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1}
      stroke='currentColor'
      className={cn('w-10 h-10', className)}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
      />
    </svg>
  );
};

export const MinusCircledIcon = ({ className }: { className?: string }): React.JSX.Element => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1}
      stroke='currentColor'
      className={cn('w-10 h-10', className)}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
      />
    </svg>
  );
};

// Geter for the icons

type AdditionalIcons = 'Setting' | 'Cash';

export type Icons = IconName | PaymentMethod | AdditionalIcons;

export function getIcon(name: IconName | PaymentMethod | AdditionalIcons, className: string = 'w-10 h-10 ml-2'): React.JSX.Element {
  switch (name) {
    case 'Glass':
      return (
        <GlassIcon
          className={className}
          key='Glass'
        />
      );
    case 'Beer':
      return (
        <BeerIcon
          className={className}
          key='Beer'
        />
      );
    case 'Food':
      return (
        <FoodIcon
          className={className}
          key='Food'
        />
      );
    case 'Soft':
      return (
        <SoftIcon
          className={className}
          key='Soft'
        />
      );
    case 'Barrel':
      return (
        <BarrelIcon
          className={className}
          key='Barrel'
        />
      );
    case 'Misc':
      return (
        <MiscIcon
          className={className}
          key='Misc'
        />
      );
    case 'Lydia':
      return (
        <LydiaIcon
          className={className}
          key='Lydia'
        />
      );
    case 'Cash':
    case 'Espèces':
      return (
        <CashIcon
          className={className}
          key='Cash'
        />
      );
    case 'CB':
      return (
        <CBIcon
          className={className}
          key='CB'
        />
      );
    case 'Virement':
      return (
        <VirementIcon
          className={className}
          key='Virement'
        />
      );
    case 'Setting':
      return (
        <SettingsIcon
          className={className}
          key='Setting'
        />
      );
  }
}
