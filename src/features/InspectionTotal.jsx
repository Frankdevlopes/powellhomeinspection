import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts';

export default function InspectionTotal() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f0f0' }}>
      <Card
        style={{
          padding: '20px',
          maxWidth: '90%',
          width: '800px',
          margin: 'auto',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
        }}
      >
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom style={{ textAlign: 'center', color: '#333' }}>
            Total Inspections
          </Typography>
          <LineChart
            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
            series={[
              {
                data: [2, 5.5, 2, 8.5, 1.5, 5],
                label: 'Inspections',
                borderColor: 'teal',
                backgroundColor: 'rgba(0, 128, 128, 0.2)',
                borderWidth: 2,
                pointBackgroundColor: 'white',
                pointBorderColor: 'teal',
                pointRadius: 5,
                pointHoverRadius: 7,
              },
            ]}
            width={700}
            height={500}
            options={{
              responsive: true,
              plugins: {
                tooltip: {
                  enabled: true,
                  callbacks: {
                    label: function (context) {
                      return `${context.dataset.label}: ${context.raw}`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                  },
                },
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

