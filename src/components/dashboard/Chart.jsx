import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { CartesianGrid, LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';

export default function Chart({data}) {
  const theme = useTheme();

  React.useEffect(() => {
    console.log(data);
  }, [])

  return (
    <React.Fragment>
      {/* <Title>Today</Title> */}
      <ResponsiveContainer minHeight={450}>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="weekday"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            dataKey="avgTemp"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          >
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: 'middle',
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
              Temperature (° F)
            </Label>
          </YAxis>
          <Line
            isAnimationActive={false}
            type="natural"
            dataKey="avgTemp"
            stroke={theme.palette.primary.main}
            dot={true}
            
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}