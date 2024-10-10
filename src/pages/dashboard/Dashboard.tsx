import { atomCountGlobal } from "@/states/dashboard"
import { Button, Card, Flex } from "antd"
import { useAtom } from "jotai"
import { useState } from "react"

const Dashboard = () => {
  const [countLocalState, setCountLocalState] = useState(0)
  const [countGlobal, setCountGlobal] = useAtom(atomCountGlobal)

  return (
    <Card>
      <Flex gap={24}>
        <Button
          type="primary"
          onClick={() => setCountLocalState(countLocalState + 1)}
        >
          {countLocalState} count in local state
        </Button>
        <Button type="primary" onClick={() => setCountGlobal(countGlobal + 1)}>
          {countGlobal} count in global state
        </Button>
      </Flex>
    </Card>
  )
}

export default Dashboard
