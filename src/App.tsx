import { useEffect, useState } from 'react'
import Chart from './components/Chart'
import { withLDProvider } from 'launchdarkly-react-client-sdk';


function App() {

  const ogData = [
    { x: 1, y: 13 },
    { x: 2, y: 17 },
    { x: 3, y: 23 },
    { x: 4, y: 15 },
    { x: 5, y: 20 },
    { x: 6, y: 19 },
    { x: 7, y: 14 },
    { x: 8, y: 22 },
    { x: 9, y: 13 },
    { x: 10, y: 20 },
    { x: 11, y: 18 }
  ]

  const [data, setData] = useState(ogData);

  const updateData = (newData: any) => {
    setData(newData)
  }

  return (
    <>
      <div style={{height: '100vh', width: '100vw', marginTop: '-50px'}}>
        <Chart data={data} updateData={updateData} />
      </div>
    </>
  )
}

export default App
