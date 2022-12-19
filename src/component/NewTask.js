import React from 'react'
import styled from 'styled-components'

const Container = styled.form`
  background: lightblue;
  padding: 10px;
  display: flex;
  flex: none;
  height: auto;
`

const SearchInput = styled.input`
  border: 0;
  padding: 8px;
  flex: 1 1;
`

const SubmitButton = styled.button`
  flex: none;
  width: 80px;
  border: 0;
  background: gray;
  color: #fff;
`

export default function NewTask({ addTask }) {
  return (
    <Container onSubmit={e => addTask(e)}>
      <SearchInput type='text' placeholder='New task...' name='task' />
      <SubmitButton type='submit'>Submit</SubmitButton>
    </Container>
  )
}
