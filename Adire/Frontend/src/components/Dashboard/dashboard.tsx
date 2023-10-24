import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import styles from './dashboard.module.css';

function Dashboard({ userData }: any) {
  function formatNumber(number: number) {
    if (number >= 1000000) {
      return `${(number / 1000000).toFixed(1).toLocaleString()}M`;
    }
    if (number >= 1000) {
      return `${(number / 1000).toFixed(1).toLocaleString()}K`;
    }
    return number.toFixed(1).toLocaleString();
  }

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const labels = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const monthlyEarningsData = [
    userData?.monthlySums[0],
    userData?.monthlySums[1],
    userData?.monthlySums[2],
    userData?.monthlySums[3],
    userData?.monthlySums[4],
    userData?.monthlySums[5],
    userData?.monthlySums[6],
    userData?.monthlySums[7],
    userData?.monthlySums[8],
    userData?.monthlySums[9],
    userData?.monthlySums[10],
    userData?.monthlySums[11],
  ];

  const options: any = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Insights showing current month',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1000,
          callback(tickValue: string | number) {
            return `₦${tickValue.toLocaleString()}`;
          },
        },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: monthlyEarningsData,
        borderColor: 'blue',
      },
    ],
  };

  return (
    <div>
      <div>
        <div className={styles['welcome-frame-16464']}>
          <div className={styles['welcome-somto']}>
            {`Welcome ${
              userData && userData.user.Name
                ? userData.user.Name.split(' ')[0]
                : ''
            }`}
          </div>
          <div className={styles['d-a-s-h-b-o-a-r-d']}>D A S H B O A R D</div>
        </div>
      </div>
      <div>
        <div className={styles['card-frame-16461']}>
          <div className={styles['card-frame-16456']}>
            <div className={styles['card-frame-16455']}>
              <div className={styles['card-_101']}>
                {/* {userData.Customers.length} */}
                {userData && userData.user.Customers
                  ? userData.user.Customers.length
                  : 0}
              </div>
              <div className={styles['card-customers']}>Customers</div>
            </div>
            <div className={styles['card-frame-8456']}>
              <svg
                className={styles['card-poll-people']}
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24.2361 8C23.6825 8.48863 23.3333 9.20354 23.3333 10C23.3333 11.4728 24.5272 12.6667 26 12.6667C26.2302 12.6667 27.3333 12.6667 27.9999 12M8 24C9.0414 22.9586 9.0414 21.0414 8 20C6.9586 18.9586 5.0414 18.9586 4 20M8 8C9.0414 9.0414 9.0414 10.9586 8 12C6.9586 13.0414 5.0414 13.0414 4 12M24 24C22.9586 22.9586 22.9586 21.0414 24 20C25.0414 18.9586 26.9586 18.9586 28 20M8.26667 24H23.7333C25.2268 24 25.9735 24 26.544 23.7094C27.0457 23.4537 27.4537 23.0457 27.7094 22.544C28 21.9735 28 21.2268 28 19.7333V12.2667C28 10.7732 28 10.0265 27.7094 9.45603C27.4537 8.95426 27.0457 8.54631 26.544 8.29065C25.9735 8 25.2268 8 23.7333 8H8.26667C6.77319 8 6.02646 8 5.45603 8.29065C4.95426 8.54631 4.54631 8.95426 4.29065 9.45603C4 10.0265 4 10.7732 4 12.2667V19.7333C4 21.2268 4 21.9735 4.29065 22.544C4.54631 23.0457 4.95426 23.4537 5.45603 23.7094C6.02646 24 6.77319 24 8.26667 24ZM18.6667 16C18.6667 17.4728 17.4728 18.6667 16 18.6667C14.5272 18.6667 13.3333 17.4728 13.3333 16C13.3333 14.5272 14.5272 13.3333 16 13.3333C17.4728 13.3333 18.6667 14.5272 18.6667 16Z"
                  stroke="#5925DC"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <div className={styles['card-frame-16460']}>
            <div className={styles['card-frame-16459']}>
              <div className={styles['card-n-48-000']}>
                ₦
                {userData?.user.ProfitMade
                  ? formatNumber(userData?.totalSum)
                  : 0}
              </div>
              <div className={styles['card-profit-made-so-far']}>
                Profit made so far
              </div>
            </div>
            <div className={styles['card-frame-8456']}>
              <svg
                className={styles['card-money-bill']}
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24.2361 8C23.6825 8.48863 23.3333 9.20354 23.3333 10C23.3333 11.4728 24.5272 12.6667 26 12.6667C26.2302 12.6667 27.3333 12.6667 27.9999 12M8 24C9.0414 22.9586 9.0414 21.0414 8 20C6.9586 18.9586 5.0414 18.9586 4 20M8 8C9.0414 9.0414 9.0414 10.9586 8 12C6.9586 13.0414 5.0414 13.0414 4 12M24 24C22.9586 22.9586 22.9586 21.0414 24 20C25.0414 18.9586 26.9586 18.9586 28 20M8.26667 24H23.7333C25.2268 24 25.9735 24 26.544 23.7094C27.0457 23.4537 27.4537 23.0457 27.7094 22.544C28 21.9735 28 21.2268 28 19.7333V12.2667C28 10.7732 28 10.0265 27.7094 9.45603C27.4537 8.95426 27.0457 8.54631 26.544 8.29065C25.9735 8 25.2268 8 23.7333 8H8.26667C6.77319 8 6.02646 8 5.45603 8.29065C4.95426 8.54631 4.54631 8.95426 4.29065 9.45603C4 10.0265 4 10.7732 4 12.2667V19.7333C4 21.2268 4 21.9735 4.29065 22.544C4.54631 23.0457 4.95426 23.4537 5.45603 23.7094C6.02646 24 6.77319 24 8.26667 24ZM18.6667 16C18.6667 17.4728 17.4728 18.6667 16 18.6667C14.5272 18.6667 13.3333 17.4728 13.3333 16C13.3333 14.5272 14.5272 13.3333 16 13.3333C17.4728 13.3333 18.6667 14.5272 18.6667 16Z"
                  stroke="#5925DC"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <div className={styles['card-frame-16458']}>
            <div className={styles['card-frame-16457']}>
              <div className={styles['card-_24']}>
                {userData && userData.user.ReceiptsGenerated
                  ? userData?.user.ReceiptsCount
                  : 0}
              </div>
              <div className={styles['card-receipts-generated']}>
                Receipts generated
              </div>
            </div>
            <div className={styles['card-frame-8456']}>
              <svg
                className={styles['card-receipt-alt-1']}
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.0001 14.6667H20.0001M12.0001 9.33333H17.3334M12.0001 20H20.0001M6.66675 28V10.4C6.66675 8.15979 6.66675 7.03969 7.10272 6.18404C7.48622 5.43139 8.09814 4.81947 8.85079 4.43597C9.70643 4 10.8265 4 13.0667 4H18.9334C21.1736 4 22.2937 4 23.1494 4.43597C23.902 4.81947 24.5139 5.43139 24.8974 6.18404C25.3334 7.03969 25.3334 8.15979 25.3334 10.4V28L22.4167 25.3333L18.9167 28L16.0001 25.3333L13.0834 28L9.58341 25.3333L6.66675 28Z"
                  stroke="#5925DC"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className={styles['chart-rectangle-2042']}>
          <div className={styles['chart-frame-16462']}>
            <div className={styles['chart-showing-monthly-chart']}>
              Showing monthly chart
            </div>
            <div className={styles['chart-insights-showing-current-month']}>
              <Line options={options} data={data} />;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
