import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  flex: 1;
  padding: 20px;
`

export default function NoTasks() {
  return (
    <Container>
      <p>Görev oluşturun</p>
      <p>
        Tüm görevler indexedDB ile tarayıcınızda saklanır, böylece daha sonra tekrar gelebilirsiniz ve görevleriniz hala burada
        olacaktır.
      </p>
    </Container>
  )
}
