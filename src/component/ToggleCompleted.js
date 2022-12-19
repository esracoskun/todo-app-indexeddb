import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex: none;
  height: auto;
  background: lightblue;
  padding: 10px;
`

export default function ToggleCompleted({ handleChange, checked }) {
  return (
    <Container>
      <input type='checkbox' onChange={handleChange} checked={checked} />
      Hide finished tasks
    </Container>
  )
}
