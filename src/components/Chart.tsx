import { VictoryChart, VictoryTheme, VictoryLine, DomainTuple, VictoryAxis, VictoryLabel } from "victory";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";
import { startTransition, useState } from "react";

function rando(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

const duration = 300;

const addAndShift = (data: {x: number; y: number}[], flagValue: boolean) => {
  const min = flagValue ? 2 : 13
  const max = flagValue ? 7 : 24
  const rate = rando(min, max);
  data.push({
    x: data.length,
    y: rate
  })
  return data
}

const Chart = ({data, updateData}: {data: {x: number; y: number}[]; updateData: Function}) => {
  const client = useLDClient();
  const flagValue = client?.variation("temp-chart-self-healing", false);
  const [range, setRange] = useState<DomainTuple>([1, 10])
  const [count, setCount] = useState(1)

  return (
    <VictoryChart
    >
      <VictoryLine domain={{ x: range, y:[0, 100]}}
        name = "dataLine"
        data = {data}
        interpolation="natural"
        animate={{
          easing: "linear", 
          duration: duration,
          onEnd: () => {
            const newData = addAndShift(data, flagValue)
            updateData(newData);
            setCount(count + 1);
            const [start, end] = range;
            let newStart = (start as number)
            let newEnd = (end as number)
            if (count % 2 === 0) {
              newStart += 2
              newEnd += 2
            }
            setRange([newStart, newEnd])
          }}}
      />
      <VictoryLine
        name = "thresholdLine"
        style={{
          data: {
            stroke: "red",
            strokeWidth: 5
          }
        }}
        labels={["Max Error Rate"]}
        labelComponent={
          <VictoryLabel textAnchor="start" y={130} x={100}/>
        }
        y={() => 60}
      />
      <VictoryAxis tickFormat={() => ''} label="time" />
      <VictoryAxis dependentAxis label="error rate"/>
    </VictoryChart>
  )
}

export default Chart;