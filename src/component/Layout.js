import React from 'react'
import PropTypes from 'prop-types'
import './Layout.css'

export default function Layout({ children }) {
  return <main>{children}</main>
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}
